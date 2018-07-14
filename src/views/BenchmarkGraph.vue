<template>
  <graph :links="links" :nodes="nodes" :loaded="loaded" :color="color" :clickedNode="clicked">
    <template slot="drawer">
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
    </template>
  </graph>
</template>

<script>
  import Graph from '@/components/Graph'

  export default {
    name: 'BenchmarkGraph',
    components: {Graph},
    data () {
      return {
        courses: [],
        benchmarks: [],
        benchmarkLookup: {},
        courseLookup: {},
        colors: {benchmark: '#15abff', course: '#ffe800'},
        selected: {},
        loaded: false
      }
    },
    methods: {
      clicked (node) {
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
