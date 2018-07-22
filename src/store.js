import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import { router } from '@/router'
import { copy, makeLookup } from '@/_'
import * as jsonpatch from 'fast-json-patch'
import { getField, updateField } from 'vuex-map-fields'
import * as _ from 'lodash'

const instance = axios.create({baseURL: process.env.SERVER_BASE})

Vue.use(Vuex)

const state = {
  courses: [],
  benchmarks: [],
  forms: {
    courses: {
      number: '',
      title: '',
      maintainer: '',
      description: '',
      inClass: '',
      inLab: '',
      learningOutcomes: [{value: ''}],
      prerequisites: '',
      recommended: '',
      corequisites: '',
      assessments: [{assessmentType: '', description: ''}],
      averageGrade: '',
      percentFailure: '',
      sections: [{section: '', instructor: '', sectionCount: 0}],
      auDistribution: {math: '', naturalScience: '', complementaryStudies: '', engineeringScience: '', engineeringDesign: ''},
      caebAttributes: {knowledgeBase: '', problemAnalysis: '', investigation: '', design: '', tools: '', team: '', communication: '', professionalism: '', impacts: '', ethics: '', economics: '', ll: ''},
      benchmarks: []
    },
    benchmarks: {
      name: '',
      accreditor: ''
    }
  },
  history: {},
  // the states of the objects (courses / benchmarks at various datetimes)
  // for example {[an_id]: {'June 14': {...}}, [another_id]: {...}}
  // This contains both courses and benchmarks; however, the _id values are unlikely to overlap
  states: {},
  parsed: [],
  token: localStorage.getItem('user-token') || '',
  open: true,
  width: window.innerWidth
}

// duplicate forms for resetting
Object.keys(state.forms).map(key => {
  const form = state.forms[key]
  state.forms[key] = {
    blank: copy(form),
    current: form
  }
})

const getters = {
  hamburger: (_, getters) => {
    return getters.authenticated
  },
  courseNumberLookup: (state) => {
    return makeLookup(state.courses, 'number')
  },
  benchmarkNameLookup: (state) => {
    return makeLookup(state.benchmarks)
  },
  courseIdLookup: (state) => {
    return makeLookup(state.courses, '_id')
  },
  benchmarkIdLookup: (state) => {
    return makeLookup(state.benchmarks, '_id')
  },
  authenticated: state => !!state.token,
  getField
}

const actions = {
  addItem ({ commit, state }, object) {
    let item = copy(state.forms[object].current)

    if (object === 'courses') {
      item.learningOutcomes = item.learningOutcomes.map(outcome => outcome.value)
    }

    instance.post(`/${object}`, item)
      .then(() => {
        commit('addItem', {item, object})
      })
      .catch(err => {
        throw err
      })
  },
  deleteItem ({ commit }, {object, _id}) {
    instance.delete(`/${object}/${_id}`).then(() => {
      commit('removeItem', {object: object, _id: _id})
    })
    router.go(-1)
  },
  patchItem ({ commit, getters, state }, { item, object, type }) {
    let oldItem = item
    const filter = (obj) => {
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

    let newItem = copy(state.forms[object].current)
    filter(newItem)

    oldItem = copy(oldItem)
    const index = oldItem.index
    const _id = oldItem._id
    delete oldItem._id
    delete oldItem.index
    filter(oldItem)

    if (object === 'courses' && oldItem.learningOutcomes) {
      oldItem.learningOutcomes = oldItem.learningOutcomes.map(outcome => ({value: outcome}))
    }

    const patch = jsonpatch.compare(oldItem, newItem)
    instance.patch(`/${object}/${_id}?type=${type}`, patch).then(() => {
      commit('patchItem', {item: newItem, index, object})
      router.go(-1)
    })
  },
  addBenchmark ({ commit, state }) {
    instance.post(`/benchmarks`, state.benchmark).then(() => {
      commit('addBenchmark', state.benchmark)
    })
  },
  loadItems ({ commit }, object) {
    instance.get(`/${object}`)
      .then(r => {
        commit('setItems', {items: r.data, object: object})
      })
      .catch(err => {
        console.error(err)
      })
  },
  loadParsed ({ commit }) {
    instance.get(`/parse`)
      .then(r => {
        commit('setParsed', r.data)
      }, err => {
        throw err
      })
  },
  loadHistory ({ commit, state }, {object, _id}) {
    if (_id in state.history) {
      return
    }

    instance.get(`/${object}/${_id}/history`)
      .then(res => {
        commit('addPatch', {patch: res.data, _id: _id})
      }, err => {
        throw err
      })
  },
  loadAtDate ({ commit }, { object, _id, date }) {
    instance.get(`/${object}/${_id}?date=${date}`)
      .then(res => {
        commit('setObjectState', {object: object, course: res.data, date: date})
      }, err => {
        console.error(err)
      })
  },
  login ({ commit, dispatch }, user) {
    instance.post(`/login`, user)
      .then(r => {
        localStorage.setItem('user-token', r.data)
        axios.defaults.headers.common['Authorization'] = r.data
        router.push({name: 'home'})
      })
      .catch(err => {
        localStorage.removeItem('user-token') // if the request fails, remove any possible user token if possible
        throw err
      })
  },
  register ({ dispatch, commit }, user) {
    instance.post(`/register`, user)
      .then(() => dispatch('login', user))
      .catch(err => {
        commit('setErrorMessage', err)
      })
  },
  logout: () => {
    localStorage.removeItem('user-token')
    router.push({name: 'login'})
  }
}

const mutations = {
  addItem (state, {object, item}) {
    state[object].push(item)
  },
  removeItem (state, {object, _id}) {
    state[object] = state[object].filter(item => _id !== item._id)
  },
  patchItem (state, {object, item, index}) {
    state[object][index] = item
  },
  clickedDynamicInput (state, {key, index}) {
    let array = state
    for (const subKey of key.split('.')) {
      array = array[subKey]
    }

    if (array.length - 1 === index) {
      const element = array[0]
      let newElement = {}
      for (const prop of Object.keys(element)) {
        newElement[prop] = ''
      }
      array.push(newElement)
    } else {
      array.splice(index, 1)
    }
  },
  setItems (state, { items, object }) {
    for (let i = 0; i < items.length; i++) {
      items[i].index = i
    }
    state[object] = items
  },
  resetForm (state, {object, item}) {
    console.info('Resetting the form!', item)
    item = item || {}
    item = copy(item)
    if (object === 'course') {
      if (item.learningOutcomes) {
        item.learningOutcomes = item.learningOutcomes.map(outcome => ({value: outcome}))
      }
    }
    delete item._id
    delete item.index
    state.forms[object].current = {...state.forms[object].blank, ...item}
  },
  addPatch (state, {patch, _id}) {
    console.info('Adding patch!')
    Vue.set(state.history, _id, patch)
  },
  setObjectState (state, { course, date }) {
    if (!(course._id in state.states)) {
      Vue.set(state.states, course._id, {})
    }

    Vue.set(state.states[course._id], date, course)
  },
  setParsed (state, parsed) {
    state.parsed = parsed
  },
  setErrorMessage (state, err) {
    console.error(err.response.data)
  },
  updateField
}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})
