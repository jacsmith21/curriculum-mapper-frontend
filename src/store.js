import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import { router } from '@/router'
import { copy, makeLookup } from '@/_'
import * as jsonpatch from 'fast-json-patch'
import { getField, updateField } from 'vuex-map-fields'
import * as _ from 'lodash'

const base = process.env.SERVER_BASE
Vue.use(Vuex)

const state = {
  displayCourses: true,
  title: 'Curriculum Mapper',
  courses: [],
  benchmarks: [],
  blank: {
    name: '',
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
    sections: [{section: '', instructor: ''}],
    auDistribution: {math: '', naturalScience: '', complementaryStudies: '', engineeringScience: '', engineeringDesign: ''},
    caebAttributes: {knowledgeBase: '', problemAnalysis: '', investigation: '', design: '', tools: '', team: '', communication: '', professionalism: '', impacts: '', ethics: '', economics: '', ll: ''},
    benchmarks: []
  },
  benchmark: {name: '', accreditor: ''},
  history: {},
  course: null,
  // the states of the objects (courses / benchmarks at various datetimes)
  // for example {[an_id]: {'June 14': {...}}, [another_id]: {...}}
  // This contains both courses and benchmarks; however, the _id values are unlikely to overlap
  states: {},
  parsed: [],
  token: localStorage.getItem('user-token') || ''
}

// initialize blank form
state.form = copy(state.blank)

const getters = {
  courseNameLookup: (state) => {
    return makeLookup(state.courses)
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
  addCourse ({ commit, state }) {
    let course = copy(state.form)
    course.learningOutcomes = course.learningOutcomes.map(outcome => outcome.value)
    axios.post(`${base}/courses`, course).then(() => {
      commit('addCourse', course)
    })
  },
  deleteItem ({ commit }, {object, _id}) {
    axios.delete(`${base}/${object}/${_id}`).then(() => {
      commit('removeItem', {object: object, _id: _id})
    })
    router.go(-1)
  },
  patchCourse ({ commit, getters, state }, oldCourse) {
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

    let newCourse = copy(state.form)
    filter(newCourse)

    oldCourse = copy(oldCourse)
    const index = oldCourse.index
    const _id = oldCourse._id
    delete oldCourse._id
    delete oldCourse.index
    filter(oldCourse)

    if (oldCourse.learningOutcomes) {
      oldCourse.learningOutcomes = oldCourse.learningOutcomes.map(outcome => ({value: outcome}))
    }

    const patch = jsonpatch.compare(oldCourse, newCourse)
    axios.patch(`${base}/courses/${_id}`, patch).then(() => {
      commit('patchCourse', [newCourse, index])
      router.push(`/courses/${oldCourse.name}`)
    })
  },
  addBenchmark ({ commit, state }) {
    axios.post(`${base}/benchmarks`, state.benchmark).then(() => {
      commit('addBenchmark', state.benchmark)
    })
  },
  loadItems ({ commit }, object) {
    axios
      .get(`${base}/${object}`)
      .then(r => {
        commit('setItems', {items: r.data, object: object})
      })
      .catch(err => {
        console.error(err)
      })
  },
  loadParsed ({ commit }) {
    return new Promise((resolve, reject) => {
      axios.get(`${base}/parse`)
        .then(r => {
          commit('setParsed', r.data)
        }, err => {
          reject(err)
        })
    })
  },
  loadHistory ({ commit, state }, {object, _id}) {
    return new Promise((resolve, reject) => {
      if (!(_id in state.history)) {
        axios.get(`${base}/${object}/${_id}/history`)
          .then(res => {
            commit('addPatch', {patch: res.data, _id: _id})
            resolve()
          }, err => {
            reject(err)
          })
      }
      resolve(state.history[_id])
    })
  },
  loadAtDate ({ commit }, { object, _id, date }) {
    axios.get(`${base}/${object}/${_id}?date=${date}`)
      .then(res => {
        commit('setObjectState', {object: object, course: res.data, date: date})
      }, err => {
        console.error(err)
      })
  },
  login ({ commit, dispatch }, user) {
    axios.post(`${base}/login`, user)
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
  register ({ dispatch }, user) {
    axios.post(`${base}/register`, user)
      .then(() => dispatch('login', user))
      .catch(err => { throw err })
  },
  logout: () => {
    localStorage.removeItem('user-token')
    router.push({name: 'login'})
  }
}

const mutations = {
  addCourse (state, course) {
    state.courses.push(course)
  },
  removeItem (state, {object, _id}) {
    state[object] = state[object].filter(item => _id !== item._id)
  },
  patchCourse (state, [course, index]) {
    state.courses[index] = course
  },
  addBenchmark (state, strand) {
    state.benchmarks.push(strand)
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
  resetForm (state, course) {
    console.log('Resetting the form!')
    course = course || {}
    course = copy(course)
    if (course.learningOutcomes) {
      course.learningOutcomes = course.learningOutcomes.map(outcome => ({value: outcome}))
    }
    delete course._id
    delete course.index
    state.form = {...state.blank, ...course}
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
  updateField
}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})
