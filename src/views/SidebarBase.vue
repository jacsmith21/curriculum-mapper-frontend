<template>
  <v-container>
    <v-navigation-drawer
      v-model="open"
      clipped
      fixed
      app
    >
      <v-list two-line>
        <template v-for="(item, index) in items">
          <v-list-tile
            ripple
            :key="item.title"
            :to="item.to"
            class="tile"
          >
            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              <v-list-tile-sub-title class="text--primary">{{ item.headline }}</v-list-tile-sub-title>
              <v-list-tile-sub-title>{{ item.subtitle }}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider v-if="index + 1 < items.length" :key="index"></v-divider>
        </template>
      </v-list>
    </v-navigation-drawer>

    <toolbar :clicked="clicked"></toolbar>

    <slot></slot>
  </v-container>
</template>

<script>
  import Toolbar from '@/components/Toolbar'

  export default {
    data () {
      return {
        open: true
      }
    },
    components: {Toolbar},
    computed: {
      items () {
        let state = this.$store.state
        if (state.displayCourses) {
          return state.courses.map(course => { return {title: course.name, headline: course.title || 'No Title', to: '/courses/' + course.name} })
        } else {
          return state.benchmarks.map(benchmark => { return {title: benchmark.name, headline: 'No Title'} })
        }
      }
    },
    methods: {
      clicked () {
        console.log('Opening or closing drawer!')
        this.open = !this.open
      }
    }
  }
</script>

<!--suppress CssUnusedSymbol -->
<style>
  .list__tile {
    font-weight: 400!important;
    font-size: 16px!important;
  }
</style>
