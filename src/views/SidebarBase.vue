<template>
  <v-container>
    <v-navigation-drawer
      v-model="open"
      clipped
      fixed
      app
    >
      <v-list two-line>
        <v-list-tile>
          <v-text-field
            label="Filter"
            :flat="!focused"
            prepend-inner-icon="search"
            solo
            v-model="search"
            @focus="focused = true"
            @blur="focused = false"
          ></v-text-field>
        </v-list-tile>

        <template v-for="(item, index) in items">
          <v-list-tile
            ripple
            :key="item.title"
            :to="item.to"
            class="tile"
          >
            <v-list-tile-content>
              <v-list-tile-title class="title">{{ item.title }}</v-list-tile-title>
              <v-list-tile-sub-title class="text--primary sub-title">{{ item.headline }}</v-list-tile-sub-title>
              <v-list-tile-sub-title>{{ item.subtitle }}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider v-if="index + 1 < items.length" :key="index"></v-divider>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-container fluid style="margin: 0; overflow: auto">
      <v-layout row wrap>
        <v-flex xs12>
          <slot></slot>
        </v-flex>
      </v-layout>
    </v-container>

    <toolbar :clicked="clicked"></toolbar>

  </v-container>
</template>

<script>
  import Toolbar from '@/components/Toolbar'

  export default {
    data () {
      return {
        open: true,
        search: '',
        focused: false
      }
    },
    components: {Toolbar},
    computed: {
      items () {
        let state = this.$store.state
        if (state.displayCourses) {
          return state.courses
            .filter(this.filterFunction)
            .map(course => { return {title: course.name, headline: course.title || 'No Title', to: `/courses/${course.name}`} })
        } else {
          return state.benchmarks
            .filter(this.filterFunction)
            .map(benchmark => { return {title: benchmark.name, headline: 'No Title', to: `/benchmarks/${benchmark.name}`} })
        }
      },
      searchTerm () {
        return this.search.toLowerCase()
      }
    },
    methods: {
      clicked () {
        console.log('Opening or closing drawer!')
        this.open = !this.open
      },
      filterFunction (item) {
        return item.name.toLowerCase().startsWith(this.searchTerm)
      }
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
