import axios from "axios"
import {Buffer} from 'buffer'



let a:string = '1' 
function fn(a:string):void{
  console.log(a)
}
fn(a)

function logFn(x:number):void;
function logFn(x:string):void;
function logFn(x: number | string){
  console.log(x)
}

logFn(12)
