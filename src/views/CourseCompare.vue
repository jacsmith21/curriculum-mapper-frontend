<template>
  <j-compare object="courses" :compute-items="computeCourseItems" :item="course"></j-compare>
</template>

<script>
  import JCompare from '@/components/JCompare'
  import { computeCourseItems } from '@/_'

  export default {
    name: 'CourseCompare',
    components: {JCompare},
    computed: {
      course () {
        return this.$store.getters.courseNumberLookup[this.number] || {}
      },
      number () {
        return this.$route.params.name
      }
    },
    methods: { computeCourseItems }
  }
</script>
