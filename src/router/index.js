import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Test from '@/components/Test'
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
      path: '/test',
      component: Test
    },
    {
      path: '/instructors/:instructor/:name',
      component: Course
    }
  ]
})
