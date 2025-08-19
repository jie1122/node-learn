import Decimal from 'decimal.js';


/**
  求和函数，处理小数问题
*/
function sumOfNum(list: (string|number)[] ){
  let sum = new Decimal(0)
  
  if (list?.length) {
    list.forEach(e => {
        sum = Decimal.add(sum, e )
    });
  }
  return sum.toNumber();
}

export {sumOfNum}


console.log( sumOfNum([1.1,2.1,'3',]))