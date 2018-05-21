import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import router from '@/router'

Vue.use(Vuex)

const state = {
  courses: [],
  form: {
    name: {label: 'Name', value: ''},
    instructor: {label: 'Instructor', value: ''},
    description: {label: 'Description', value: ''},
    learningOutcomes: {label: 'Learning Outcomes', value: [], items: ['Trigonometry', 'Java', 'Loops', 'Teamwork'], type: 'tagselect'}
  }
}

const getters = {
  getCourse: (state) => (instructor, name) => {
    return state.courses.filter(course => course.instructor === instructor && course.name === name)[0]
  },
  getCourseById: (state) => (id) => {
    for (let course of state.courses) {
      if (course._id === id) {
        return course
      }
    }
  }
}

const actions = {
  loadCourses ({ commit }) {
    axios
    .get('http://localhost:3000/courses')
    .then(r => r.data)
    .then(courses => {
      commit('setCourses', courses)
    })
  },
  addCourse ({ commit, state }) {
    const form = state.form
    const course = Object.keys(form).reduce((course, key) => Object.assign(course, {[key]: form[key]['value']}), {})
    axios.post('http://localhost:3000/courses', course).then(() => {
      commit('addCourse', course)
    })
  },
  deleteCourse ({ commit }, course) {
    axios.delete('http://localhost:3000/courses/' + course._id).then(() => {
      commit('removeCourse', course)
    })
  },
  editCourse ({ commit, getters }, edit) {
    const course = getters.getCourseById(edit.id)
    course[edit.key] = edit.value
    axios.put('http://localhost:3000/courses/' + course._id, course).then(() => {
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
    state.form[payload.key]['value'] = payload.value
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
