import axios from "axios"

axios({
  url:"http://www.baidu.com"
}).then(res => {
  console.log( res.data)
  debugger
})