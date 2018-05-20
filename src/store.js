import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const getItems = (length) => {
  let array = []
  for (let i = 0; i < length; i++) {
    array.push({
      instructor: 'Dr. MacIsaac',
      name: 'CS10' + i,
      description: 'This is the ' + i + 'th index!'
    })
  }
  array.push({
    instructor: 'Add a Course',
    name: 'Add a Course',
    description: 'None'
  })
  return array
}

const state = {
  courses: getItems(8)
}

const getters = {
  getCourse: (state) => (instructor, name) => {
    return state.courses.filter(course => course.instructor === instructor && course.name === name)[0]
  }
}

const mutations = {
  addCourse (state, payload) {
    state.courses.push({
      instructor: payload['Instructor'],
      name: payload['Name'],
      description: this.form['Description']
    })
  }
}

export default new Vuex.Store({
  state,
  getters,
  mutations
})
