import {
  Connection,
  ConnectionOptions,
  QueryOptions,
  QueryResult,
  RowDataPacket,
} from 'mysql2'
import mysql from 'mysql2'

/** 对mysql2 的方法使用promise 包装 */
export class MysqlUtil {
  connection: Connection

  constructor(option: ConnectionOptions) {
    this.connection = mysql.createConnection(option)
  }

  /** 连接到数据库 */
  connect() {
    return new Promise((resolve, reject) => {
      this.connection.connect(error => {
        if (error) {
          console.error('连接到数据库时出错: ' + error.stack)
          return reject(error)
        } else {
          console.log('成功连接到数据库 ' + this.connection.config)
          return resolve(true)
        }
      })
    })
  }

  queryData(option: QueryOptions) {
    return new Promise<RowDataPacket[]>((resolve, reject) => {
      this.connection.query<RowDataPacket[]>(
        option,
        (error, results, fields) => {
          if (error) {
            console.error('查询时出错: ' + error.stack)
            return reject(error)
          }
          // 查询完成
          // console.log('查询完成')
          return resolve(results)
        }
      )
    })
  }

  end() {
    this.connection.end()
  }
}

export default MysqlUtil
