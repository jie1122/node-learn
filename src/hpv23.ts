import MysqlUtil from './utils/mysqlUtil.ts'
import { saveFile } from './utils/fileUtil.ts'

const option = {
  host: '192.168.1.66', // 数据库主机名
  port: 13306,
  user: 'root', // 数据库用户名
  password: 'root', // 数据库密码
  database: 'yudao-cloud', // 数据库名称
}
const mysqlUtil = new MysqlUtil(option)
await mysqlUtil.connect()

async function main() {
  const list: any[] = await getData()
  console.log(list)
  const errorList = await getErrorData(list)
  console.log(errorList)

  saveFile('hpv23.json', JSON.stringify(errorList, null, 2))
}

main()

/** 查询出所有的hpv23 检测结果 */
async function getData() {
  const query = `
    SELECT * FROM bpm_process_instance_ext
    WHERE name = "人乳头瘤病毒(HPV23)"
  `
  const list = []

  try {
    const res = await mysqlUtil.queryData({ sql: query })
    res.forEach(e => {
      if (e.form_variables) {
        // 解析 form_variables
        e.form_variables = JSON.parse(e.form_variables)
      }
      list.push(e)
    })
  } finally {
    mysqlUtil.end()
  }

  return list
}

/** 过滤出 大于0 小于2 的 检测结果 */
function getErrorData(list: any[]) {
  const errorList = []

  list.forEach(row => {
    const v = row.form_variables
    for (const key in v) {
      if (
        key.startsWith('HPV') &&
        parseFloat(v[key]) > 0 &&
        parseFloat(v[key]) < 2
      ) {
        return errorList.push(row)
      }
    }
  })
  return errorList
}
