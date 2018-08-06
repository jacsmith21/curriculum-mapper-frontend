import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import { router } from '@/router'
import { copy, COURSE, makeLookup, filter } from '@/_'
import * as jsonpatch from 'fast-json-patch'
import { getField, updateField } from 'vuex-map-fields'

const baseUrl = process.env.SERVER_BASE
const instance = axios.create({baseURL: baseUrl})

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
      sections: [{section: '', instructor: '', count: 0}],
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
  width: window.innerWidth,
  drawerExists: false,
  errors: false
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
  hamburger: (state, getters) => {
    return getters.authenticated && state.drawerExists
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
  authenticated: state => !!state.token,
  getField
}

const actions = {
  addItem ({ commit, state }, object) {
    let item = copy(state.forms[object].current)

    if (object === COURSE) {
      item.learningOutcomes = item.learningOutcomes.map(outcome => outcome.value)
    }

    // This is important as we filter out empty objects
    filter(item)

    instance.post(`/${object}`, item)
      .then(r => {
        commit('addItem', {item, object, _id: r.data})
        router.push({name: object})
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

    let newItem = copy(state.forms[object].current)
    filter(newItem)

    oldItem = copy(oldItem)
    const index = oldItem.index
    const _id = oldItem._id
    delete oldItem._id
    delete oldItem.index
    filter(oldItem)

    if (object === COURSE && oldItem.learningOutcomes) {
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
  loadAtTime ({ commit }, { object, _id, time }) {
    instance.get(`/${object}/${_id}?time=${time}`)
      .then(res => {
        commit('setObjectState', {object: object, course: res.data, time})
      }, err => {
        console.error(err)
      })
  },
  async login ({ commit, dispatch }, user) {
    return new Promise((resolve, reject) => {
      instance.post(`/login`, user)
        .then(r => {
          console.info('User successfully logged in!')
          const token = r.data
          localStorage.setItem('user-token', token)
          axios.defaults.headers.common['Authorization'] = token
          commit('setToken', token)
          resolve(r.data)
        })
        .catch(e => {
          localStorage.removeItem('user-token') // if the request fails, remove any possible user token if possible
          commit('setErrors')
          reject(e)
        })
    })
  },
  register ({ dispatch, commit }, user) {
    instance.post(`/register`, user)
      .then(() => dispatch('login', user))
      .catch(err => {
        commit('setErrorMessage', err)
      })
  },
  logout: ({ commit }) => {
    commit('logout')
  },
  excelExport (_, _id) {
    const url = `${baseUrl}/export/${_id}`
    window.open(url)
  }
}

const mutations = {
  addItem (state, {object, item, _id}) {
    item._id = _id
    state[object].push(item)
  },
  removeItem (state, {object, _id}) {
    state[object] = state[object].filter(item => _id !== item._id)
  },
  patchItem (state, {object, item, index}) {
    state[object][index] = item
  },
  clickedDynamicInput (state, {key, index}) {
    let array = state.forms.courses.current[key]

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
    if (object === COURSE) {
      if (item.learningOutcomes) {
        item.learningOutcomes = item.learningOutcomes.map(outcome => ({value: outcome}))
      }
    }
    delete item._id
    delete item.index
    state.forms[object].current = {...state.forms[object].blank, ...item}
  },
  addPatch (state, {patch, _id}) {
    Vue.set(state.history, _id, patch)
  },
  setObjectState (state, { course, time }) {
    if (!(course._id in state.states)) {
      Vue.set(state.states, course._id, {})
    }

    Vue.set(state.states[course._id], time, course)
  },
  setParsed (state, parsed) {
    state.parsed = parsed
  },
  setErrorMessage (state, err) {
    console.error(err.response.data)
  },
  setToken (state, token) {
    state.token = token
  },
  logout (state) {
    localStorage.removeItem('user-token')
    state.token = ''
    router.push({name: 'login'})
  },
  setErrors (state, errors = true) {
    state.errors = errors
  },
  updateField
}

const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})

instance.interceptors.response.use(undefined, err => {
  return new Promise(() => {
    if (err.config && err.response && err.response.status === 401) {
      // noinspection JSUnresolvedFunction
      store.dispatch('logout')
    }
    throw err
  })
})

export {store as default}
