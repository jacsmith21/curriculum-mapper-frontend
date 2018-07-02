import Vue from 'vue'
import Router from 'vue-router'
import PrerequisiteGraph from '@/components/PrerequisiteGraph'
import CourseForm from '@/components/CourseForm'
import CourseCard from '@/components/CourseCard'
import StrandForm from '@/components/StrandForm'
import BenchmarkGraph from '@/components/BenchmarkGraph'

// noinspection JSUnresolvedFunction
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: CourseForm
    },
    {
      path: '/courses',
      component: CourseForm
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
      component: CourseCard
    },
    {
      path: '/visualize',
      component: BenchmarkGraph
    }
  ]
})
