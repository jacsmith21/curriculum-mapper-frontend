import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import router from '@/router'

const base = process.env.SERVER_BASE
Vue.use(Vuex)

const state = {
  courses: [],
  form: {
    name: '',
    instructor: '',
    description: '',
    learningOutcomes: [],
    prerequisites: []
  }
}

const getters = {
  getCourse: (state) => (instructor, name) => {
    return state.courses.filter(course => course.instructor === instructor && course.name === name)[0]
  }
}

const actions = {
  loadCourses ({ commit }) {
    axios
    .get(base + '/courses')
    .then(r => r.data)
    .then(courses => {
      commit('setCourses', courses)
    })
  },
  addCourse ({ commit, state }) {
    const form = state.form
    const course = Object.keys(form).reduce((course, key) => Object.assign(course, {[key]: form[key]}), {})
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
    router.push('/instructors/' + course.instructor + '/' + course.name)
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
    state.courses = state.courses.filter(c => c.name !== course.name || c.instructor !== course.instructor)
  },
  editForm (state, payload) {
    state.form[payload.key] = payload.value
  },
  editCourse (state, course) {
    state.courses[course.index] = course
  }
}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})
