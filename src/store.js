import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import router from '@/router'
import { copy } from '@/_'
import { getField, updateField } from 'vuex-map-fields'

const base = process.env.SERVER_BASE
Vue.use(Vuex)

const state = {
  courses: [],
  form: {
    name: '',
    title: '',
    maintainer: '',
    description: '',
    inClass: '',
    inLab: '',
    learningOutcomes: [{value: ''}],
    prerequisites: [],
    assessments: [{type: '', description: ''}],
    averageGrade: '',
    percentFailure: '',
    sections: [{section: '', instructor: ''}],
    auDistribution: {math: '', naturalScience: '', complementaryStudies: '', engineeringScience: '', engineeringDesign: ''},
    caebAttributes: {knowledgeBase: '', problemAnalysis: '', investigation: '', design: '', tools: '', team: '', communication: '', professionalism: '', impacts: '', ethics: '', economics: '', ll: ''}
  }
}

const getters = {
  courseByName: (state) => (name) => {
    return state.courses.filter(course => course.name === name)[0]
  },
  courseById: (state) => (id) => {
    return state.courses.filter(course => course._id === id)[0]
  },
  lastIndex: (state) => (key, index) => {
    return state.form[key].length - 1 === index
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
  addCourse ({ commit, state, getters }) {
    let course = copy(state.form)
    course.prerequisites = course.prerequisites.map(prerequisite => getters.courseByName(prerequisite))
    course.learningOutcomes = course.learningOutcomes.map(outcome => outcome.value)
    axios.post(base + '/courses', course).then(() => {
      commit('addCourse', course)
    })
  },
  deleteCourse ({ commit }, course) {
    axios.delete(base + '/courses/' + course._id).then(() => {
      commit('removeCourse', course)
    })
    router.go(-1)
  },
  editCourse ({ commit, getters }, edit) {
    const course = edit.instance
    course[edit.key] = edit.value
    axios.put(base + '/courses/' + course._id, course).then(() => {
      commit('editCourse', course)
    })
    router.push('/courses/' + course.name)
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
  editCourse (state, course) {
    state.courses[course.index] = course
  },
  clickedDynamicInput (state, {key, index}) {
    const array = state.form[key]
    if (array.length - 1 === index) {
      const element = array[0]
      let newElement = {}
      for (const key in element) {
        newElement[key] = ''
      }
      array.push(newElement)
    } else {
      array.splice(index, 1)
    }
  },
  updateField
}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})
