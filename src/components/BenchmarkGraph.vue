<template>
  <v-container ref="container">
    <v-navigation-drawer
      v-model="open"
      clipped
      fixed
      right
      app>
      <v-list two-line subheader>
        <v-subheader>Information</v-subheader>
        <v-list-tile>
          <v-list-tile-content>
            <v-list-tile-title>{{ selectedCourse.name }}</v-list-tile-title>
            <v-list-tile-sub-title>{{ selectedCourse.title || 'No Title' }}</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <v-divider></v-divider>

      <!--<v-list two-line subheader>-->
        <!--<v-subheader>Prerequisites</v-subheader>-->
        <!--<v-list-tile v-for="prereq in selectedCourse.prereqs" @click="" :key="prereq">-->
          <!--<v-list-tile-content>-->
            <!--<v-list-tile-title>{{ prereq }}</v-list-tile-title>-->
            <!--<v-list-tile-sub-title>{{ prereq.title || 'No Title' }}</v-list-tile-sub-title>-->
          <!--</v-list-tile-content>-->
        <!--</v-list-tile>-->
      <!--</v-list>-->

    </v-navigation-drawer>

    <toolbar ref="toolbar"></toolbar>

    <v-container v-bind:style="{padding: 0}" fluid @click="open = false">
      <svg ref="svg" style="width:100%;height:100%;position:fixed;top:0;left:0;bottom:0;right:0;">
        <g :id="links"></g>
        <g :id="nodes"></g>
      </svg>
    </v-container>
  </v-container>
</template>

<!--suppress JSUnresolvedVariable -->
<script>
  import * as d3 from 'd3'
  import Toolbar from '@/components/Toolbar'
  import { graph } from '@/mixins'

  export default {
    name: 'BenchmarkGraph',
    components: {Toolbar},
    mixins: [graph],
    data () {
      return {
        courses: null,
        benchmarks: null,
        courseLookup: {},
        selectedCourse: {}
      }
    },
    methods: {
      clicked () {
        this.open = true

        d3.event.stopPropagation()
      }
    },
    created () {
      const that = this
      this.$store.dispatch('loadCourses').then(courses => {
        that.courses = courses
        that.$store.dispatch('loadBenchmarks').then(benchmarks => {
          that.benchmarks = benchmarks
          that.loaded = true
          that.initiate()
        })
      })
    },
    computed: {
      nodes () {
        if (!this.loaded) {
          return
        }

        return this.parsed.map(course => ({id: course.name}))
      },
      links () {
        if (!this.loaded) {
          return
        }

        const links = []
        this.parsed.map((course, index) => {
          course.prereqs.map(prereq => {
            if (prereq in this.courseLookup) {
              const target = this.courseLookup[prereq].index
              links.push({source: target, target: index})
            }
          })

          course.coreqs.map(coreq => {
            if (coreq in this.courseLookup) {
              const target = this.courseLookup[coreq].index
              links.push({source: index, target: target})
            }
          })
        })

        return links
      }
    }
  }
</script>

<style>
  .node text {
    pointer-events: none;
    font: 10px sans-serif;
  }

  /*noinspection CssUnusedSymbol*/
  .unselectable {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
</style>

