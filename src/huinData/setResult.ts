import { MongoClient } from 'mongodb'

/** 本地mongo，用于缓存中间数据 */
const local_mongo_client: MongoClient = new MongoClient(
  'mongodb://localhost:27017'
)
await local_mongo_client.connect()
const cache_data_db = local_mongo_client.db('cache_data')
console.log('local_mongo_client  connected')

/** pigx数据库 */
const pigx_mongo_client: MongoClient = new MongoClient(
  'mongodb://sy_admin:sy_admin@192.168.1.66:27017'
)
await pigx_mongo_client.connect()
const sy_product_center = pigx_mongo_client.db('sy_product_center')
console.log('pigx_mongo_client  connected')


async function main() {
  const pageSize = 1000
  let finishedCount = 0 // 已处理数据数量
  let total = 0

  const res = await getSampleList()
  total = res.total
  console.log('共' + total + '条数据')
  // return
  while (finishedCount < total) {
    const res = await getSampleList(finishedCount, pageSize)
    total = res.total
    for (const sample of res.list) {
      sample.result = formatResult(sample)
    }

    await saveSampleListToPigx(res.list)
    finishedCount += res.list.length
    console.log(`已处理${finishedCount}/${total}条`)
  }

  local_mongo_client.close()
  pigx_mongo_client.close()
}
main()

/** 处理实验结果，有配置处理; 无配置，返回原结果 */
function formatResult(sample) {
  const originResult = sample.extend
  const confFields = sample.formConf?.form_design?.output
  let result = []
  sample.form_title = sample.formConf?.form_title || '未定义'
  if (confFields) {
    confFields.forEach(e => {
      result.push({
        name:e.name,
        type:e.type,
        value:originResult[e.key],
      })
    })
  } else {
    for (const key in originResult) {
      if (Object.prototype.hasOwnProperty.call(originResult, key)) {
        result.push({
          name:key,
          value:originResult[key],
        })
      }
    }
  }

  return result
}


/**
 *  查询样本数据
 *  */
async function getSampleList(skip = 0, pageSize = 10) {
  const huin_sample = cache_data_db.collection('huin_sample')

  const total = await huin_sample.countDocuments({})
  const list = await huin_sample.find({}).skip(skip).limit(pageSize).toArray()

  return {
    total,
    list,
  }
}

// 保存样本到本地mongo
function saveSampleList(samples) {
  const huin_sample = cache_data_db.collection('huin_result')
  return huin_sample.insertMany(samples)
}

// 保存到pigx mongo
function saveSampleListToPigx(samples) {
  const dms_test_task_sample = sy_product_center.collection('dms_test_task_sample')
  return dms_test_task_sample.insertMany(samples)
}
