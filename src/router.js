import Vue from 'vue'
import Router from 'vue-router'
import PrerequisiteGraph from '@/components/PrerequisiteGraph'
import CourseForm from '@/components/CourseForm'
import CourseCard from '@/components/CourseCard'
import StrandForm from '@/components/StrandForm'
import Test from '@/components/Test'

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
      path: '/test',
      component: Test
    }
  ]
})
