<template>
  <sidebar-base>
    <j-drawer :items="items"></j-drawer>
    <j-card :item="course" actions date :compute-items="computeCourseItems" object="courses"></j-card>
  </sidebar-base>
</template>


<script>
  import SidebarBase from '@/views/SidebarBase'
  import JCard from '@/components/JCard'
  import { computeCourseItems } from '@/_'
  import JDrawer from '@/components/JDrawer'
  import { mapGetters } from 'vuex'

  export default {
    name: 'Course',
    components: {JDrawer, JCard, SidebarBase},
    computed: {
      number () {
        return this.$route.params.name
      },
      course () {
        return this.courseNumberLookup[this.number] || this.firstCourse
      },
      firstCourse () {
        if (this.items.length) {
          // noinspection JSPotentiallyInvalidTargetOfIndexedPropertyAccess
          return this.items[0]
        } else {
          return {}
        }
      },
      items () {
        return this.$store.state.courses.map(course =>
          ({title: course.number, headline: course.title || 'No Title', to: `/courses/${course.number}`}))
      },
      ...mapGetters(['courseNumberLookup'])
    },
    methods: { computeCourseItems }
  }
</script>
