import Vue from 'vue'
import Router from 'vue-router'
import PrerequisiteGraph from '@/components/PrerequisiteGraph'
import CourseForm from '@/components/CourseForm'
import CourseCard from '@/components/CourseCard'
import StrandForm from '@/components/StrandForm'
import BenchmarkGraph from '@/components/BenchmarkGraph'
import Compare from '@/views/Compare'

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
      name: 'edit',
      path: '/courses/:name/edit',
      component: CourseForm,
      props: {edit: true}
    },
    {
      path: '/visualize',
      component: BenchmarkGraph
    },
    {
      name: 'compare',
      path: '/courses/:name/compare/:then/:now',
      component: Compare
    }
  ]
})
