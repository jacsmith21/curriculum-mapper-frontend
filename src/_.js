export const copy = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}

export const makeLookup = (items, key = 'name') => {
  return items.reduce((lookup, item) => {
    lookup[item[key]] = item
    return lookup
  }, {})
}

export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const computeCourseItems = (course) => {
  return [
    ['Name', course.name],
    ['Title', course.title],
    ['Description', course.description],
    ['Maintainer', course.maintainer],
    ['Prerequisites', course.prerequisites],
    ['Corequisites', course.corequisites],
    ['Recommended', course.recommended]
  ]
}

export const normalize = (vector) => {
  return div(vector, length(vector))
}

export const length = ({ x, y }) => {
  return Math.sqrt(x * x + y * y)
}

export const div = ({ x, y }, scalar) => {
  return {x: x / scalar, y: y / scalar}
}

export const add = ({x: x1, y: y1}, {x: x2, y: y2}) => {
  return {x: x1 + x2, y: y1 + y2}
}

export const sub = ({x: x1, y: y1}, {x: x2, y: y2}) => {
  return {x: x1 - x2, y: y1 - y2}
}

export const scale = (vector, scalar) => {
  return prod(normalize(vector), scalar)
}

export const prod = ({x, y}, scalar) => {
  return {x: x * scalar, y: y * scalar}
}

export const radiusVector = (link, radius) => {
  return scale(sub(link.target, link.source), radius)
}
