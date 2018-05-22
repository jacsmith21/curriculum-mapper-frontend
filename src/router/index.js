import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import PrerequisiteGraph from '@/components/PrerequisiteGraph'
import Course from '@/components/Course'

// noinspection JSUnresolvedFunction
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '/prerequisites',
      component: PrerequisiteGraph
    },
    {
      path: '/instructors/:instructor/:name',
      component: Course
    }
  ]
})
