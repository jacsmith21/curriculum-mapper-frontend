<template>
  <j-compare object="courses" :compute-items="computeCourseItems" :item="benchmark"></j-compare>
</template>

<script>
  import JCompare from '@/components/JCompare'
  import { computeCourseItems } from '@/_'

  export default {
    name: 'CourseCompare',
    components: {JCompare},
    computed: {
      benchmark () {
        return this.$store.getters.courseNameLookup[this.name] || {}
      },
      name () {
        return this.$route.params.name
      }
    },
    methods: { computeCourseItems }
  }
</script>
