import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

const state = {
  courses: []
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
      title: state.newTodo,
      completed: false
    }
    axios.post('/courses', course).then(() => {
      commit('addCourse', course)
    })
  }
}

const mutations = {
  setCourses: (state, courses) => {
    state.courses = courses
  },
  addCourse (state, payload) {
    console.log(payload)
    state.courses.push({
      instructor: payload['Instructor'],
      name: payload['Name'],
      description: payload['Description']
    })
  }
}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})
