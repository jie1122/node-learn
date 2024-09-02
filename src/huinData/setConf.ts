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
console.log('huindata_mongo_client  connected')
const huindata_mongo_db = huindata_mongo_client.db('huindata')

/** 本地mongo，用于缓存中间数据 */
const local_mongo_client = new MongoClient('mongodb://localhost:27017')
await local_mongo_client.connect()
const cache_data_db = local_mongo_client.db('cache_data')

async function main() {
  const pageSize = 10
  const res = await getSampleList()
  let total = res.total 
  console.log('共' + total + '条数据')

  let finishedCount = 0 // 已处理数据数量

  while (finishedCount < 200) {
    const res = await getSampleList(
      finishedCount,
      pageSize
    )
    total = res.total
    for (const sample of res.list) {
      console.log('-----------------' + sample.formKey + '-----------------')
      const conf = await getFormConf(sample.formKey)
      if (conf) {
        conf.form_design = JSON.parse(conf.form_design)
        sample.formConf = conf
      }
    }

    await saveSampleList(res.list)
    finishedCount += res.list.length

    console.log(`已处理${finishedCount}/${total}条`)
  }

  // console.log(res.list)
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
async function getFormConf(formKey) {
  const queryOptions = {
    sql: 'SELECT * FROM hd_cdm_form WHERE form_key = ?',
    values: [formKey],
  }
  const res = await huindata_mysql.queryData(queryOptions)
  if (res.length) {
    return res[0]
  }
}

// 保存样本到本地mongo
function saveSampleList(samples) {
  const huin_sample = cache_data_db.collection('huin_sample')
  return huin_sample.insertMany(samples)
}
