import { Connection, ConnectionOptions, QueryResult } from 'mysql2'
import mysql from 'mysql2'

export class MysqlUtil  {
  connection: Connection 

  constructor(option:ConnectionOptions){
    this.connection = mysql.createConnection(option)

    this.connection.connect(err => {
      if (err) {
        console.error('连接到数据库时出错: ' + err.stack)
        return
      }
      console.log('成功连接到数据库，连接 ID 是 ' + this.connection.threadId)
    })
  }

  queryData(query: string){
    // 连接到数据库
    return new Promise<QueryResult>( (resolve, reject) => {
      this.connection.query({ sql: query }, (error, results, fields) => {
        // 关闭连接
        this.connection.end()
        if (error) {
          console.error('查询时出错: ' + error.stack)
          return reject(error)
        }
        return resolve(results )
      })
    })
  }

  end() {
    this.connection.end()
  }
}

export default MysqlUtil
