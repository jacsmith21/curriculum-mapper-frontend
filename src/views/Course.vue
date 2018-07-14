<template>
  <sidebar-base>
    <j-card :item="course" actions :compute-items="computeCourseItems" object="courses"></j-card>
  </sidebar-base>
</template>


<script>
  import SidebarBase from '@/views/SidebarBase'
  import JCard from '@/components/JCard'
  import { computeCourseItems } from '@/_'

  export default {
    name: 'Course',
    components: { JCard, SidebarBase },
    computed: {
      name () {
        return this.$route.params.name
      },
      course: function () {
        return this.$store.getters.courseNameLookup[this.name] || {}
      }
    },
    methods: { computeCourseItems }
  }
</script>
