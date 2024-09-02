import { MongoClient } from 'mongodb'
import MysqlUtil from '../utils/mysqlUtil.ts'

/** 慧因mysql */
const huindata_mysql = new MysqlUtil({
  host: '192.168.1.31',
  port: 3306,
  user: 'sy',
  password: 'Hao123.com',
  database: 'huindata',
})
await huindata_mysql.connect()

/** 慧因mongo */
const huindata_mongo_client = new MongoClient(
  'mongodb://huindata:huindata2020@192.168.1.31:27017'
)
await huindata_mongo_client.connect()
const huindata_mongo_db = huindata_mongo_client.db('huindata')
console.log('huindata_mongo_client  connected')

/** 本地mongo，用于缓存中间数据 */
const local_mongo_client = new MongoClient('mongodb://localhost:27017')
await local_mongo_client.connect()
const cache_data_db = local_mongo_client.db('cache_data')
console.log('local_mongo_client  connected')

async function main() {
  const pageSize = 100
  let finishedCount = 0 // 已处理数据数量
  let total = 0

  const confMap = await getAllConfMap() //  一次性查出所有表单配置, 用map保存, 便于后续使用

  const res = await getSampleList()
  total = res.total
  console.log('共' + total + '条数据')

  while (finishedCount < 200) {
    const res = await getSampleList(finishedCount, pageSize)
    total = res.total
    for (const sample of res.list) {
      console.log('-----------------' + sample.formKey + '-----------------')
      sample.formConf = confMap.get(sample.formKey)
    }

    // 将修改后的样本数据存入本地数据库
    await saveSampleList(res.list)
    finishedCount += res.list.length

    console.log(`已处理${finishedCount}/${total}条`)
  }

  huindata_mongo_client.close()
  local_mongo_client.close()
  huindata_mysql.end()
}
main()

// 查询样本数据
async function getSampleList(skip = 0, pageSize = 10) {
  const query = {
    formKey: { $exists: true, $ne: '' },
    createTime: { $lt: 20240527000000 },
  }

  // 慧因样本集合
  const dms_sample = huindata_mongo_db.collection('dms_sample')

  const total = await dms_sample.countDocuments(query)
  const list = await dms_sample
    .find(query)
    .skip(skip)
    .limit(pageSize)
    .sort({ createTime: -1 })
    .toArray()

  return {
    total,
    list,
  }
}

//  查询表单配置
async function getAllConfMap() {
  const queryOptions = {
    sql: 'SELECT * FROM hd_cdm_form WHERE del_flag= "FALSE"',
  }
  const confList = await huindata_mysql.queryData(queryOptions)
  const confMap = new Map()
  confList.forEach(e => {
    e.form_design = JSON.parse(e.form_design)
    confMap.set(e.form_key, e)
  })
  return confMap
}

// 保存样本到本地mongo
function saveSampleList(samples) {
  const huin_sample = cache_data_db.collection('huin_sample')
  return huin_sample.insertMany(samples)
}
