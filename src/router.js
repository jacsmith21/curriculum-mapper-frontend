import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import PrerequisiteGraph from '@/components/PrerequisiteGraph'
import CourseForm from '@/components/CourseForm'
import StrandForm from '@/components/StrandForm'

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
      path: '/benchmarks',
      component: StrandForm
    },
    {
      path: '/prerequisites',
      component: PrerequisiteGraph
    },
    {
      path: '/courses/:name',
      component: CourseForm
    }
  ]
})
