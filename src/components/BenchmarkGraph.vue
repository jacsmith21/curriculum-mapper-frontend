<template>
  <v-container>
    <v-navigation-drawer
      v-model="open"
      clipped
      fixed
      right
      app>
      <v-list two-line subheader>
        <v-subheader>{{ selected.type }}</v-subheader>
        <v-list-tile>
          <v-list-tile-content>
            <v-list-tile-title>{{ selected.name }}</v-list-tile-title>
            <v-list-tile-sub-title>{{ selected.title || 'No Title' }}</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <v-divider></v-divider>

      <v-list two-line subheader>
        <v-subheader>{{ selected.subTitle }}</v-subheader>
        <v-list-tile v-for="item in selected.items" @click="" :key="item.name">
          <v-list-tile-content>
            <v-list-tile-title>{{ item.name }}</v-list-tile-title>
            <v-list-tile-sub-title>{{ item.title || 'No Title' }}</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <toolbar></toolbar>

    <v-container v-bind:style="{padding: 0}" fluid @click="open = false">
      <svg style="width:100%;height:100%;position:fixed;top:0;left:0;bottom:0;right:0;">
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
        courses: [],
        benchmarks: [],
        benchmarkLookup: {},
        courseLookup: {},
        colors: {benchmark: '#15abff', course: '#ffe800'},
        selected: {}
      }
    },
    methods: {
      clicked (node) {
        this.open = true

        let type = null
        let subTitle = null
        let items = null

        if (node.benchmark) {
          type = 'Benchmark'
          subTitle = 'Courses'
          items = (this.benchmarkLookup[node._id].courses || []).map(_id => this.courseLookup[_id.$oid])
        } else {
          type = 'Course'
          subTitle = 'Benchmarks'
          items = (this.courseLookup[node._id].benchmarks || []).map(_id => this.benchmarkLookup[_id.$oid])
        }

        this.selected = {
          name: node.id,
          type: type,
          subTitle: subTitle,
          items: items
        }
        d3.event.stopPropagation()
      },
      color (node) {
        return node.benchmark ? this.colors.benchmark : this.colors.course
      }
    },
    created () {
      const that = this
      this.$store.dispatch('loadCourses').then(courses => {
        that.courses = courses
        for (const course of courses) {
          that.courseLookup[course._id] = course
        }

        that.$store.dispatch('loadBenchmarks').then(benchmarks => {
          that.benchmarks = benchmarks
          for (const [i, benchmark] of benchmarks.entries()) {
            that.benchmarkLookup[benchmark._id] = benchmark
            benchmark.index = courses.length + i
          }

          for (const course of courses) {
            for (const _id of course.benchmarks || []) {
              let benchmark = that.benchmarkLookup[_id.$oid]
              benchmark.courses = benchmark.courses || []
              benchmark.courses.push({$oid: course._id})
            }
          }

          that.loaded = true
          that.initiate()
        })
      })
    },
    computed: {
      nodes () {
        return this.courses.map(item => ({id: item.name, _id: item._id, benchmark: false}))
          .concat(this.benchmarks.map(benchmark => ({id: benchmark.name, _id: benchmark._id, benchmark: true})))
      },
      links () {
        if (!this.loaded) {
          return []
        }

        let links = []
        this.courses.map((course, index) => {
          for (const _id of course.benchmarks || []) {
            links.push({source: this.benchmarkLookup[_id.$oid].index, target: index})
          }
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

