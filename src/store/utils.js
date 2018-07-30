import store from '@/store/index'
import * as _ from 'lodash'
import { mapFields, mapMultiRowFields } from 'vuex-map-fields'

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
