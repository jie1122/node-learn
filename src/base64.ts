import axios from "axios"
import fs from "node:fs"
import url from 'node:url'
import path from 'node:path';

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const fullPath = path.resolve(__dirname, './assets/data/vess.txt')

axios({
  url: 'https://bhw43.no-mad-world.club/link/TvQV598WfVePfS2U?sub=3&extend=1',
}).then(res => {
  // console.log(res.data)
  const str = Buffer.from(res.data, 'base64').toString('utf-8')
  let outputStr = ''
  str.split('\n').forEach(item => {

    if (item.startsWith('ss://')) {
      const str2 = item.replace(/.*\/\//,'')

      const preStr = Buffer.from( str2.replace( /#.*/, '') , 'base64').toString('utf8')
      const subStr =  decodeURIComponent( str2.replace( /.*#/, '') )
      const str3 = preStr + '#' + subStr
      console.log(str3)
      outputStr += str3 + '\n'
    }else{
      const str2 = item.replace(/.*\/\//,'')
      const str3 = Buffer.from(str2, 'base64').toString('utf8')
      console.log(str3)
      outputStr += str3 + '\n'
    }

  })
  fs.writeFile(fullPath, outputStr,(err) => {
    if (err) {
      return console.error(err);
    }
  })
  
})