<template>
  <sidebar-base>

  </sidebar-base>
</template>

<script>
  import SidebarBase from '@/views/SidebarBase'

  export default {
    name: 'Compare',
    components: { SidebarBase },
    computed: {
      name () {
        return this.$route.params.name
      },
      then () {
        return this.$route.params.then
      },
      now () {
        return this.$route.params.now
      },
      _id () {
        return this.$store.getters.courseByName(this.name)._id
      },
      mounted () {
        this.$store.dispatch('loadCourseAtDate', {_id: this._id, date: this.then})
        this.$store.dispatch('loadCourseAtDate', {_id: this._id, date: this.now})
      },
      states () {
        return this.$store.state.courseStates[this._id] || {}
      },
      courseThen () {
        return this.states[this.then] || {}
      },
      courseNow () {
        return this.states[this.now] || {}
      }
    }
  }
</script>

<style scoped>

</style>
