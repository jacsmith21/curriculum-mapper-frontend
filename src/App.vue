<template>
  <v-app>
    <v-content>
      <router-view/>

      <v-toolbar app clipped-left clipped-right color="amber">
        <v-btn v-if="hamburger" icon @click.stop="open = !open">
          <v-icon>menu</v-icon>
        </v-btn>
        <!--<v-toolbar-title>{{ title }}</v-toolbar-title>-->

        <v-btn fab icon :loading="loading"><v-icon medium>find_in_page</v-icon></v-btn>
        <v-toolbar-items class="hidden-sm-and-down">
          <v-btn flat to="/courses">Courses</v-btn>
          <v-btn flat to="/benchmarks">Benchmarks</v-btn>
        </v-toolbar-items>

        <v-spacer></v-spacer>
        <j-toolbar-dropdown
          :items="[['Course', {name: 'createCourse'}], ['Benchmark', {name: 'createBenchmark'}]]" label="Create">
        </j-toolbar-dropdown>
        <j-toolbar-dropdown
          :items="[['Prerequisite Graph', {name: 'prereqGraph'}], ['Benchmark Graph', {name: 'benchmarkGraph'}], ['Grouping Graph', '/grouping'], ['Logout', logout]]">
          <v-btn fab flat style="margin: 0">
            <v-icon medium>account_circle</v-icon>
          </v-btn>
        </j-toolbar-dropdown>
      </v-toolbar>

    </v-content>
    <v-footer fixed app>
      <v-layout column align-center>
        <span>&copy; 2018 Jacob Smith</span>
      </v-layout>
    </v-footer>
  </v-app>
</template>

<script>
  import { mapGetters, mapState } from 'vuex'
  import axios from 'axios'
  import JToolbarDropdown from '@/components/JToolbarDropdown'

  export default {
    name: 'App',
    components: {JToolbarDropdown},
    data () {
      return {
        open: true,
        title: 'Curriculum Mapper',
        filter: '',
        focused: false
      }
    },
    computed: {
      items () {
        if (this.routeName.endsWith('Graph') || 'lsdkfj') {
          return []
        }

        let state = this.$store.state
        if (state.displayCourses) {
          return state.courses
            .map(course => ({title: course.number, headline: course.title || 'No Title', to: `/courses/${course.number}`}))
        } else {
          return state.benchmarks
            .map(benchmark => ({title: benchmark.name, headline: benchmark.accreditor || 'No Accreditor', to: `/benchmarks/${benchmark.name}`}))
        }
      },
      hamburger () {
        return !!this.items.length && this.authenticated
      },
      routeName () {
        return this.$route.name || ''
      },
      filteredItems () {
        return this.items.filter(this.filterFunction)
      },
      ...mapGetters(['authenticated']),
      ...mapState(['loading'])
    },
    methods: {
      logout () {
        this.$store.dispatch('logout')
      }
    },
    created () {
      axios.interceptors.response.use(undefined, err => {
        console.log(err.config)
        return new Promise(() => {
          if (err.config && err.response && err.response.status === 401) {
            this.$store.dispatch('logout')
          }
          throw err
        })
      })
    },
    watch: {
      authenticated: {
        immediate: true,
        handler () {
          if (this.authenticated) {
            this.$store.dispatch('loadItems', 'courses')
            this.$store.dispatch('loadItems', 'benchmarks')
          }
        }
      }
    }
}
</script>
