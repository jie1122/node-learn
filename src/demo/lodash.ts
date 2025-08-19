import _ from 'lodash'

const object = {
  a: [{ b: 2 }, { d: 4 }],
}
const other = {
  a: [{ c: 3 }, { e: 5 }],
}
const ret =  _.merge(object, other)

const s1 = {
  a: { b: 2 }
}
const t1 = {
  a: {c: 3 }
}
const ret1=  _.merge(t1, s1)


const s2 = {
  a: { b: 2 }
}
const t2 = {
  a: {c: 3 }
}
const ret2 = Object.assign(t2, s2)


console.log(ret)
console.log(ret2)
