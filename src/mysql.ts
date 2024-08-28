import mysql from 'mysql2'

const connection = mysql.createConnection({
  host: '192.168.1.66', // 数据库主机名
  port: 13306,
  user: 'root', // 数据库用户名
  password: 'root', // 数据库密码
  database: 'sy_lims_db', // 数据库名称
})


// 连接到数据库
connection.connect(err => {
  if (err) {
    console.error('连接到数据库时出错: ' + err.stack)
    return
  }
  console.log('成功连接到数据库，连接 ID 是 ' + connection.threadId)
})

const list = []

function getReportData() {
  const query = `
    SELECT * FROM biz_report
    LIMIT 1000 ;
  `

  // 执行查询
  console.log(Date.now())
  connection.query<any[]>(query, (error, results, fields) => {
    if (error) {
      console.error('查询时出错: ' + error.stack)
      return
    }
    results.forEach(e => {
      if (e.form_json_data) {
        list.push(JSON.parse(e.form_json_data))
      }
    })

    console.log(list)
    console.log(Date.now())
  })

  // 关闭连接
  connection.end()
}


getReportData()