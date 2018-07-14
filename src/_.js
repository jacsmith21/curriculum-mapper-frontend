export const copy = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}

export const makeLookup = (items, key = 'name') => {
  return items.reduce((lookup, item) => {
    lookup[item[key]] = item
    return lookup
  }, {})
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
