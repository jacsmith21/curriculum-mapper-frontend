<template>
  <v-app>
    <v-content>

      <v-navigation-drawer v-show="hamburger" :value="open && hamburger" clipped fixed app>
        <v-list two-line>
          <v-list-tile>
            <v-text-field
              label="Filter"
              :flat="!focused"
              prepend-inner-icon="search"
              solo
              v-model="filter"
              @focus="focused = true"
              @blur="focused = false"
            ></v-text-field>
          </v-list-tile>
          <template v-for="item in filteredItems">
            <v-divider></v-divider>
            <v-list-tile ripple :key="item.title" :to="item.to" class="tile">

              <v-list-tile-content>
                <v-list-tile-title class="title">{{ item.title }}</v-list-tile-title>
                <v-list-tile-sub-title class="text--primary sub-title">{{ item.headline }}</v-list-tile-sub-title>
                <v-list-tile-sub-title>{{ item.subtitle }}</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </template>
        </v-list>
      </v-navigation-drawer>

      <!--The main content goes here-->
      <router-view/>

      <v-toolbar app clipped-left clipped-right color="amber">
        <v-btn v-show="hamburger" icon @click.stop="open = !open">
          <v-icon>menu</v-icon>
        </v-btn>
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items class="hidden-sm-and-down">
          <v-btn flat to="/courses">Add Course</v-btn>
          <v-btn flat to="/benchmarks">Add Benchmark</v-btn>
          <v-btn flat to="/visualize">Benchmark Graph</v-btn>
          <v-btn flat to="/prerequisites">Prerequisite Graph</v-btn>
        </v-toolbar-items>
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
  export default {
    name: 'App',
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
        return !!this.items.length
      },
      routeName () {
        return this.$route.name || ''
      },
      searchTerm () {
        return this.filter.toLowerCase()
      },
      filteredItems () {
        return this.items.filter(this.filterFunction)
      }
    },
    methods: {
      filterFunction (item) {
        return item.title.toLowerCase().startsWith(this.searchTerm)
      }
    },
    created () {
      this.$store.dispatch('loadItems', 'courses')
      this.$store.dispatch('loadItems', 'benchmarks')
    }
}
</script>

<style scoped>
  .title {
    font-weight: 400!important;
    font-size: 16px!important;
  }

  .sub-title {
    color: rgba(0, 0, 0, .65);
    font-weight: 400!important;
  }
</style>
