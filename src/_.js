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
    ['Number', 'number', course.number],
    ['Title', 'title', course.title],
    ['Description', 'description', course.description],
    ['Maintainer', 'maintainer', course.maintainer],
    ['Prerequisites', 'prerequisites', course.prerequisites],
    ['Corequisites', 'corequisites', course.corequisites],
    ['Recommended', 'recommended', course.recommended]
  ]
}

export const computeBenchmarkItems = (benchmark) => {
  return [
    ['Name', 'name', benchmark.name],
    ['Accreditor', 'accreditor', benchmark.accreditor]
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
