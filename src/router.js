import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import PrerequisiteGraph from '@/views/PrerequisiteGraph'
import CourseForm from '@/views/CourseForm'
import Course from '@/views/Course'
import BenchmarkForm from '@/views/BenchmarkForm'
import BenchmarkGraph from '@/views/BenchmarkGraph'
import Benchmark from '@/views/Benchmark'
import CourseCompare from '@/views/CourseCompare'
import BenchmarkCompare from '@/views/BenchmarkCompare'
import Grouping from '@/views/Grouping'
import Login from '@/views/Login'
import Register from '@/views/Register'
import { BENCHMARK, COURSE } from '@/_'

// noinspection JSUnresolvedFunction
Vue.use(Router)

const authenticate = (to, from, next) => {
  if (store.getters.authenticated) {
    next()
  } else {
    next({name: 'login'})
  }
}

export const router = new Router({
  routes: [
    {
      name: 'home',
      path: '/',
      component: CourseForm,
      beforeEnter: authenticate
    },
    {
      name: 'createCourse',
      path: '/courses/create',
      component: CourseForm,
      beforeEnter: authenticate
    },
    {
      name: 'createBenchmark',
      path: '/benchmarks/create',
      component: BenchmarkForm,
      beforeEnter: authenticate
    },
    {
      name: BENCHMARK,
      path: '/benchmarks/:name?',
      component: Benchmark,
      beforeEnter: authenticate
    },
    {
      name: 'prereqGraph',
      path: '/prerequisites',
      component: PrerequisiteGraph,
      beforeEnter: authenticate
    },
    {
      name: COURSE,
      path: '/courses/:name?',
      component: Course,
      beforeEnter: authenticate
    },
    {
      name: 'courses/edit',
      path: '/courses/:name/edit',
      component: CourseForm,
      props: {edit: true},
      beforeEnter: authenticate
    },
    {
      name: 'benchmarks/edit',
      path: '/benchmarks/:name/edit',
      component: BenchmarkForm,
      props: {edit: true},
      beforeEnter: authenticate
    },
    {
      name: 'benchmarkGraph',
      path: '/visualize',
      component: BenchmarkGraph,
      beforeEnter: authenticate
    },
    {
      name: 'courses/compare',
      path: '/courses/:name/compare',
      component: CourseCompare,
      beforeEnter: authenticate
    },
    {
      name: 'benchmarks/compare',
      path: '/benchmarks/:name/compare',
      component: BenchmarkCompare,
      beforeEnter: authenticate
    },
    {
      name: 'GroupingGraph',
      path: '/grouping',
      component: Grouping,
      beforeEnter: authenticate
    },
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'register',
      path: '/register',
      component: Register
    }
  ]
})
