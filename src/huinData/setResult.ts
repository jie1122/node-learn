import { MongoClient } from 'mongodb'

/** 本地mongo，用于缓存中间数据 */
const local_mongo_client: MongoClient = new MongoClient(
  'mongodb://localhost:27017'
)
await local_mongo_client.connect()
const cache_data_db = local_mongo_client.db('cache_data')

const pageSize = 3

async function main() {
  const total = await getSampleCount()
  console.log('共' + total + '条数据')
  let finishedCount = 0 // 已处理数据数量

  while (finishedCount < total) {
    const samples = await getSampleList(finishedCount, pageSize)
    for (const sample of samples) {
      sample.result = formatResult(sample)
    }

    await saveSampleList(samples)
    finishedCount += samples.length
    console.log(`已处理${finishedCount}/${total}条`)
  }

  local_mongo_client.close()
}
main()

/** 处理实验结果，有配置处理; 无配置，返回原结果 */
function formatResult(sample) {
  const originResult = sample.extend
  const confFields = sample.formConf?.form_design?.output
  let result = {}

  if (confFields) {
    confFields.forEach(e => {
      result[e.name] = originResult[e.key]
    })
  } else {
    result = originResult
  }

  return result
}

async function getSampleCount() {
  const huin_sample = cache_data_db.collection('huin_sample')
  return huin_sample.countDocuments({})
}

/**
 *  查询样本数据
 *  */
function getSampleList(skip, pageSize) {

  const huin_sample = cache_data_db.collection('huin_sample')
  return huin_sample.find({}).skip(skip).limit(pageSize).toArray()
}

// 保存样本到本地mongo
function saveSampleList(samples) {
  const huin_sample = cache_data_db.collection('huin_result')
  return huin_sample.insertMany(samples)
}
