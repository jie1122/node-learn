import fs from 'node:fs'
import url from 'node:url'
import path from 'node:path'

export function saveFile(fileName:string ,data:any){
  
  const __filename = url.fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  const fullPath = path.resolve(__dirname, '../assets/data/' + fileName)
  fs.writeFileSync(fullPath, data )
}
