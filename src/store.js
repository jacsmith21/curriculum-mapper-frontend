import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

const state = {
  courses: [],
  form: {'Name': '', 'Instructor': '', 'Description': ''}
}

const getters = {
  getCourse: (state) => (instructor, name) => {
    return state.courses.filter(course => course.instructor === instructor && course.name === name)[0]
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
    const course = {
      instructor: state.form['Instructor'],
      name: state.form['Name'],
      description: state.form['Description']
    }
    axios.post('http://localhost:3000/courses', course).then(() => {
      commit('addCourse', course)
    })
  },
  deleteCourse ({ commit }, course) {
    axios.delete('http://localhost:3000/courses/' + course._id).then(() => {
      commit('removeCourse', course)
    })
  }
}

const mutations = {
  addCourse (state, course) {
    state.courses.push(course)
  },
  setCourses: (state, courses) => {
    state.courses = courses
  },
  removeCourse (state, course) {
    state.courses = state.courses.filter(c => c.name !== course.name || c.instructor !== course.instructor)
  }
}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})
