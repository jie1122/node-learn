import { MongoClient , Db ,Collection} from "mongodb";

const client:MongoClient = new MongoClient('mongodb://localhost:27017');
let test_db:Db
try {
  await client.connect()
  console.log('MongoDB Driver connected');
  test_db = client.db('test_db');
} catch (error) {
  console.error('Connection error', error)
}

const testCollection:Collection = test_db.collection('test_collection');
testCollection.find({}).toArray().then (res => {
  console.log(res);
  client.close();
})

// testCollection.insertMany([
//   {"v":"2","ps":"剩余流量：82.39% 247.16GB","add":"www.g00gle.com","port":"10086","id":"2661b5f8-8062-34a5-9371-a44313a75b6b","aid":"2","net":"tcp","type":"none","host":"","tls":""},
//   {"v":"2","ps":"过期时间：2024-09-22 16:51:04","add":"www.g00gle.com","port":"10086","id":"2661b5f8-8062-34a5-9371-a44313a75b6b","aid":"2","net":"tcp","type":"none","host":"","tls":""},

//   {"host":"","path":"","tls":"","verify_cert":true,"add":"teqok-g06.jp05-vm5.entry.rtysjur.quest","port":"64659","aid":"1","net":"tcp","type":"none","v":"2","ps":"日本S05 | 下载专用 | x0.01","id":"0cd58c68-8a97-35f5-a6e4-59302508b038","class":5},
//   {"host":"","path":"","tls":"","verify_cert":true,"add":"ezgey-g06.jp06-vm5.entry.rtysjur.quest","port":"667","aid":"1","net":"tcp","type":"none","v":"2","ps":"日本S06 | 下载专用 | x0.01","id":"0cd58c68-8a97-35f5-a6e4-59302508b038","class":5},
//   {"host":"","path":"","tls":"","verify_cert":true,"add":"eia1y-g06.hk09-vm5.entry.v50307shvkaa.art","port":"15269","aid":"1","net":"tcp","type":"none","v":"2","ps":"香港S09 | IEPL","id":"0cd58c68-8a97-35f5-a6e4-59302508b038","class":5},
//   {"host":"bgp-01-10.entry-0.chinasnow.net","path":"/","tls":"","verify_cert":true,"add":"l2o4u-g06.hk10-vm5.entry.v50307shvkaa.art","port":"13487","aid":"1","net":"ws","type":"none","v":"2","ps":"香港S10 | IEPL","id":"0cd58c68-8a97-35f5-a6e4-59302508b038","class":5},
//   {"host":"bgp-01-11.entry-0.chinasnow.net","path":"/tutorial/iphone13.m3u8","tls":"","verify_cert":true,"add":"wldr6-g06.hk11-vm5.entry.v50307shvkaa.art","port":"579","aid":"1","net":"ws","type":"none","v":"2","ps":"香港S11 | IEPL","id":"0cd58c68-8a97-35f5-a6e4-59302508b038","class":5},
//   {"host":"","path":"","tls":"tls","verify_cert":true,"add":"6z38d-g06.jp01-0986-vm0.entry.fr0307a.art","port":"21586","aid":"1","net":"tcp","type":"none","v":"2","ps":"免费-日本1-Ver.6","id":"0cd58c68-8a97-35f5-a6e4-59302508b038","class":0},
//   {"host":"","path":"","tls":"","verify_cert":true,"add":"s2ily-g06.jp02-9a99-vm0.entry.fr0307a.art","port":"11778","aid":"1","net":"tcp","type":"none","v":"2","ps":"免费-日本2-Ver.7","id":"0cd58c68-8a97-35f5-a6e4-59302508b038","class":0},
//   {"host":"","path":"","tls":"tls","verify_cert":true,"add":"m039b-g06.jp03-7d22-vm0.entry.fr0307a.art","port":"21586","aid":"1","net":"tcp","type":"none","v":"2","ps":"免费-日本3-Ver.6","id":"0cd58c68-8a97-35f5-a6e4-59302508b038","class":0},
//   {"host":"","path":"","tls":"","verify_cert":true,"add":"7kxu2-g06.jp04-3771-vm0.entry.fr0307a.art","port":"449","aid":"1","net":"tcp","type":"none","v":"2","ps":"免费-日本4-Ver.7","id":"0cd58c68-8a97-35f5-a6e4-59302508b038","class":0},
//   {"host":"","path":"","tls":"","verify_cert":true,"add":"gpo7g-g06.jp05-6786-vm0.entry.fr0307a.art","port":"46487","aid":"1","net":"tcp","type":"none","v":"2","ps":"免费-日本5-Ver.8","id":"0cd58c68-8a97-35f5-a6e4-59302508b038","class":0},
//   {"host":"","path":"","tls":"tls","verify_cert":true,"add":"spo67-g06.jp06-7c5a-vm0.entry.fr0307a.art","port":"28788","aid":"1","net":"tcp","type":"none","v":"2","ps":"免费-日本6-Ver.7","id":"0cd58c68-8a97-35f5-a6e4-59302508b038","class":0},
//   {"host":"","path":"","tls":"","verify_cert":true,"add":"cvsnt-g06.jp07-1f28-vm0.entry.fr0307a.art","port":"28788","aid":"1","net":"tcp","type":"none","v":"2","ps":"免费-日本7-Ver.1","id":"0cd58c68-8a97-35f5-a6e4-59302508b038","class":0},
// ])