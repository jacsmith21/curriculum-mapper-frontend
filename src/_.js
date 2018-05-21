export const iterable = (obj) => {
  if (obj == null) {
    return false
  }
  return obj.constructor === Array
}
