import Vue from 'vue'
import Router from 'vue-router'
import PrerequisiteGraph from '@/views/PrerequisiteGraph'
import CourseForm from '@/views/CourseForm'
import Course from '@/views/Course'
import BenchmarkForm from '@/views/BenchmarkForm'
import BenchmarkGraph from '@/views/BenchmarkGraph'
import Benchmark from '@/views/Benchmark'
import CourseCompare from '@/views/CourseCompare'
import BenchmarkCompare from '@/views/BenchmarkCompare'

// noinspection JSUnresolvedFunction
Vue.use(Router)

export const router = new Router({
  routes: [
    {
      name: 'home',
      path: '/',
      component: CourseForm
    },
    {
      name: 'courses',
      path: '/courses',
      component: CourseForm
    },
    {
      path: '/benchmarks',
      component: BenchmarkForm
    },
    {
      path: '/benchmarks/:name',
      component: Benchmark
    },
    {
      name: 'prereqGraph',
      path: '/prerequisites',
      component: PrerequisiteGraph
    },
    {
      path: '/courses/:name',
      component: Course
    },
    {
      name: 'courses/edit',
      path: '/courses/:name/edit',
      component: CourseForm,
      props: {edit: true}
    },
    {
      name: 'benchmarks/edit',
      path: '/benchmarks/:name/edit',
      component: BenchmarkForm,
      props: {edit: true}
    },
    {
      name: 'benchmarkGraph',
      path: '/visualize',
      component: BenchmarkGraph
    },
    {
      name: 'courses/compare',
      path: '/courses/:name/compare',
      component: CourseCompare
    },
    {
      name: 'benchmarks/compare',
      path: '/benchmarks/:name/compare',
      component: BenchmarkCompare
    }
  ]
})

// TODO: Make this work
export const mapParams = (params) => {
  return {
    name () {
      return this.$route.params.name
    }
  }
  // const functions = params.reduce((functions, param) => {
  //   functions[param] = () => router.currentRoute.params[param]
  //   return functions
  // }, {})
  // console.log(functions)
  // return functions
}
