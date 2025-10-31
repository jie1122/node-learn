
import { MongoClient } from 'mongodb'
import mysql , { RowDataPacket }from 'mysql2/promise';
import {category,disease} from './category.js';

console.log('connecting database...')
/** pigx - mysql */
const sy_product_server_mysql = await mysql.createConnection({
  host: '192.168.1.37',
  port: 13306,
  user: 'root',
  password: 'root',
  database: 'sy_product_server',
})
await sy_product_server_mysql.connect()


/** 本地mongo，用于缓存中间数据 */
const local_mongo_client: MongoClient = new MongoClient(
  'mongodb://localhost:27017'
)
await local_mongo_client.connect()

console.log('database connected')


async function main() {

  const data = await getList()

  data.forEach(item=>{

    // categoryLabel
    const cate = category.find(c=>c.id === item.category_ids)
    if(cate){
      item.categoryLabel = cate.name
    } else {
      item.categoryLabel = ''
    }
    
    // 根据diseaseId设置diseaseLabel
    const dis = disease.find(d=>d.id === item.disease_category_ids)
    if(dis){
      item.diseaseLabel = dis.name
    } else {
      item.diseaseLabel = ''
    }

  })

  console.log(data.length + ' 条产品库数据');
  await saveCache(data)
  console.log('产品库数据已保存到本地mongo')

}

main()


// 查询产品库列表
async function getList() {
  const queryOptions = {
    sql: 'SELECT * FROM `biz_product_lib` WHERE del_flag = 0 AND on_shelves = 1',
  }
  const [data, fields] = await sy_product_server_mysql.query<RowDataPacket[]>(queryOptions)
  sy_product_server_mysql.end()
  return data
}


// 保存样本到本地mongo
async function saveCache(data: any[]) {
  const cache_data_mongo = local_mongo_client.db('cache_data')
  const collection = cache_data_mongo.collection('pigx_product')
  await collection.deleteMany({}) // 先清空集合
  await collection.insertMany(data)
  local_mongo_client.close()
  return
}
