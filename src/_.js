import * as _ from 'lodash'

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
    ['number'],
    ['title'],
    ['description'],
    ['maintainer'],
    ['prerequisites'],
    ['corequisites'],
    ['recommended']
  ].map(key => [courseLabelMap[key], key, course[key]])
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

export const courseLabelMap = {
  'number': 'Number',
  'title': 'Title',
  'description': 'Description',
  'maintainer': 'Maintainer',
  'prerequisites': 'Prerequisites',
  'corequisites': 'Corequisites',
  'recommended': 'Recommended'
}

export const COURSE = 'courses'

export const BENCHMARK = 'benchmarks'

export const filter = (obj) => {
  if (Array.isArray(obj)) {
    let indices = []
    for (const [i, item] of obj.entries()) {
      if (!filter(item)) {
        indices.push(i)
      }
    }
    for (const i of indices.reverse()) {
      obj.splice(i, 1)
    }
    return obj.length !== 0
  } else if (typeof obj === 'object') {
    for (const key of Object.keys(obj)) {
      if (!filter(obj[key])) {
        delete obj[key]
      }
    }
    return !_.isEmpty(obj)
  } else {
    return !!obj
  }
}
