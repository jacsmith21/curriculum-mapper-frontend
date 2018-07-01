export const iterable = (obj) => {
  if (obj == null) {
    return false
  }
  return obj.constructor === Array
}

export const copy = (obj) => {
  return Object.assign({}, obj)
}

export const Enum = (arr) => {
  let obj = {}
  for (let val of arr) {
    obj[val] = Symbol(val)
  }
  return Object.freeze(obj)
}
