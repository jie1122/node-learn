import fs from 'fs';
import path from 'path';
import url from 'url'
import { dirname, extname, resolve as resolvePath } from 'node:path';

// es6不支持__filename,__dirname 等common.js的全局变量
console.log(import.meta)
// 获取当前文件的绝对路径
const __filename = url.fileURLToPath(import.meta.url)
console.log('__filename----', __filename) 
// 获取当前文件所在目录的绝对路径
const __dirname = path.dirname(__filename)
console.log('__dirname----',__dirname)

// 获取目标文件绝对路径
const fullPath = path.resolve(__dirname,'../assets/data/test.txt')
console.log('fullPath----',fullPath)

const data =  fs.readFileSync(fullPath,'utf-8');
console.log(data)