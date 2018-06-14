import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import PrerequisiteGraph from '@/components/PrerequisiteGraph'
import Course from '@/components/Course'
import Strand from '@/components/Strand'

// noinspection JSUnresolvedFunction
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '/courses',
      component: Home
    },
    {
      path: '/strands',
      component: Strand
    },
    {
      path: '/prerequisites',
      component: PrerequisiteGraph
    },
    {
      path: '/courses/:name',
      component: Course
    }
  ]
})
