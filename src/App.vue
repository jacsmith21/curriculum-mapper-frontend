<template>
  <v-app>
    <v-content>
      <router-view/>

      <v-toolbar app clipped-left clipped-right color="amber">
        <v-toolbar-side-icon @click.stop="open = !open"></v-toolbar-side-icon>

        <v-toolbar-items class="hidden-sm-and-down" style="margin-left: 10px;">
          <v-btn flat to="/courses">Courses</v-btn>
          <v-btn flat to="/benchmarks">Benchmarks</v-btn>
        </v-toolbar-items>

        <v-spacer></v-spacer>
        <j-toolbar-dropdown :items="createItems" label="Create">
        </j-toolbar-dropdown>
        <j-toolbar-dropdown :items="userItems">
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
  import { mapGetters } from 'vuex'
  import { mapFields } from 'vuex-map-fields'
  import axios from 'axios'
  import JToolbarDropdown from '@/components/JToolbarDropdown'

  export default {
    name: 'App',
    components: {JToolbarDropdown},
    data () {
      return {
        title: 'Curriculum Mapper',
        filter: '',
        focused: false
      }
    },
    computed: {
      createItems () {
        return [['Course', {name: 'createCourse'}], ['Benchmark', {name: 'createBenchmark'}]]
      },
      userItems () {
        return [['Prerequisite Graph', {name: 'prereqGraph'}], ['Benchmark Graph', {name: 'benchmarkGraph'}], ['Grouping Graph', '/grouping'], ['Logout', this.logout]]
      },
      ...mapGetters(['authenticated', 'hamburger']),
      ...mapFields(['open', 'width'])
    },
    methods: {
      logout () {
        this.$store.dispatch('logout')
      },
      handleResize () {
        this.width = window.innerWidth
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

      window.addEventListener('resize', this.handleResize)
    },
    destroyed () {
      window.removeEventListener('resize', this.handleResize)
    }
}
</script>
