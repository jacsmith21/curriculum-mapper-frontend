import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import router from '@/router'
import { copy } from '@/_'
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
  benchmark: {name: ''},
  history: {},
  course: null
}

// initialize blank form
state.form = copy(state.blank)

const getters = {
  courseByName: (state) => (name) => {
    return state.courses.filter(course => course.name === name)[0]
  },
  getField
}

const actions = {
  loadCourses ({ commit }) {
    return new Promise((resolve, reject) => {
      axios
        .get(base + '/courses')
        .then(r => r.data)
        .then(courses => {
          commit('setCourses', courses)
          resolve(courses)
        }, err => {
          reject(err)
        })
    })
  },
  addCourse ({ commit, state }) {
    let course = copy(state.form)
    course.learningOutcomes = course.learningOutcomes.map(outcome => outcome.value)
    axios.post(`${base}/courses`, course).then(() => {
      commit('addCourse', course)
    })
  },
  deleteCourse ({ commit }, course) {
    axios.delete(`${base}/courses/${course._id}`).then(() => {
      commit('removeCourse', course)
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

    // TODO: Make sure iterable is what we want. Maybe change it to `typeof obj === 'array'`?
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
  loadBenchmarks ({ commit }) {
    return new Promise((resolve, reject) => {
      axios
        .get(`${base}/benchmarks`)
        .then(r => r.data)
        .then(benchmarks => {
          commit('setBenchmarks', benchmarks)
          resolve(benchmarks)
        }, err => {
          reject(err)
        })
    })
  },
  loadParsed () {
    return new Promise((resolve, reject) => {
      axios.get(`${base}/parse`)
        .then(r => r.data)
        .then(parsed => {
          resolve(parsed)
        }, err => {
          reject(err)
        })
    })
  },
  loadHistory ({ commit, state }, _id) {
    return new Promise((resolve, reject) => {
      if (!(_id in state.history)) {
        axios.get(`${base}/courses/${_id}/history`)
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
  loadCourseAtDate ({ commit }, { _id, date }) {
    axios.get(`${base}/courses/${_id}?date=${date}`)
      .then(res => {
        commit('setCourse', res.data)
      }, err => {
        console.error(err)
      })
  }
}

const mutations = {
  addCourse (state, course) {
    state.courses.push(course)
  },
  setCourses: (state, courses) => {
    for (let i = 0; i < courses.length; i++) {
      courses[i].index = i
    }
    state.courses = courses
  },
  removeCourse (state, course) {
    state.courses = state.courses.filter(c => c.name !== course.name)
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
  setBenchmarks (state, benchmarks) {
    state.benchmarks = benchmarks
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
  setCourse (state, course) {
    state.course = course
  },
  updateField
}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})
