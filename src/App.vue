<template>
  <v-app>
    <v-content>
      <j-drawer :items="items" :open="open"></j-drawer>
      <router-view/>
      <toolbar :hamburger="hamburger" @barClick="open = !open"></toolbar>
    </v-content>
    <v-footer fixed app>
      <v-layout column align-center>
        <span>&copy; 2018 Jacob Smith</span>
      </v-layout>
    </v-footer>
  </v-app>
</template>

<script>
  import Toolbar from '@/components/Toolbar'
  import JDrawer from '@/components/JDrawer'

  export default {
    name: 'App',
    components: {Toolbar, JDrawer},
    data () {
      return {
        open: true
      }
    },
    computed: {
      items () {
        if (this.routeName.endsWith('Graph')) {
          return []
        }

        let state = this.$store.state
        if (state.displayCourses) {
          return state.courses
            .map(course => ({title: course.name, headline: course.title || 'No Title', to: `/courses/${course.name}`}))
        } else {
          return state.benchmarks
            .map(benchmark => ({title: benchmark.name, headline: 'No Title', to: `/benchmarks/${benchmark.name}`}))
        }
      },
      hamburger () {
        return !!this.items
      },
      routeName () {
        return this.$router.currentRoute.name || ''
      }
    },
    created () {
      this.$store.dispatch('loadCourses')
      this.$store.dispatch('loadBenchmarks')
    }
}
</script>
