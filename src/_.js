import { mapFields, mapMultiRowFields } from 'vuex-map-fields'
import store from '@/store'
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

export const mapForm = (keys) => {
  let form = store.state
  keys = keys.split('.')
  keys.map(key => {
    form = form[key]
  })

  let multiRowFields = []
  let fields = []
  const map = (object, base) => {
    Object.keys(object).map(name => {
      const field = form[name]
      if (_.isArray(field)) {
        if (field.length) {
          multiRowFields.push([...base, name])
        } else {
          fields.push([...base, name])
        }
      } else if (_.isObject(field)) {
        map(field, [...base, name])
      } else {
        fields.push([...base, name])
      }
    })
  }
  map(form, keys)
  fields = fields.map(name => name.join('.'))
  multiRowFields = multiRowFields.map(name => name.join('.'))
  return {
    ...mapFields(fields),
    ...mapMultiRowFields(multiRowFields)
  }
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
