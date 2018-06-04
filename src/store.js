import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import router from '@/router'
import { copy } from '@/_'

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
  courseByName: (state) => (name) => {
    return state.courses.filter(course => course.name === name)[0]
  },
  courseById: (state) => (id) => {
    return state.courses.filter(course => course._id === id)[0]
  }
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
    state.courses = state.courses.filter(c => c.name !== course.name || c.instructor !== course.instructor)
  },
  editForm (state, {key, value, index}) {
    if (index === undefined) {
      state.form[key] = value
    } else {
      let array = state.form[key]
      if (array.length === index) {
        array.push(value)
      } else {
        array[index] = value
      }
    }
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
