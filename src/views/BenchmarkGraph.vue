<template>
  <j-graph
    :links="links"
    :nodes="nodes"
    :loaded="loaded"
    :color="color"
    drawer
    :clickedNode="clicked">
    <!--suppress JSUnresolvedVariable -->
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
  </j-graph>
</template>

<script>
  import JGraph from '@/components/JGraph'
  import { mapState, mapGetters } from 'vuex'
  import { BENCHMARK } from '@/_'

  export default {
    name: 'BenchmarkGraph',
    components: {JGraph},
    data () {
      return {
        colors: {benchmark: '#15abff', course: '#ffe800'},
        selected: {}
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
          items = this.coursesLookup[node.id] || []
        } else {
          type = 'Course'
          subTitle = 'Benchmarks'
          items = (this.courseLookup[node._id].benchmarks || []).map(name => this.benchmarkLookup[name])
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
          for (const name of course.benchmarks || []) {
            if (!(name in this.benchmarkLookup)) {
              console.info(`${name} not in the benchmark lookup`)
              continue
            }
            links.push({source: this.benchmarkLookup[name].index + this.courses.length, target: index})
          }
        })

        return links
      },
      coursesLookup () {
        let coursesLookup = {}
        for (const course of this.courses) {
          for (const name of course.benchmarks || []) {
            if (!(name in this.benchmarkLookup)) {
              console.info(`${name} not in the benchmark lookup`)
              continue
            }
            let benchmark = this.benchmarkLookup[name]
            coursesLookup[benchmark.name] = coursesLookup[benchmark.name] || []
            coursesLookup[benchmark.name].push(course)
          }
        }
        return coursesLookup
      },
      loaded () {
        return !this._.isEmpty(this.courses) && !this._.isEmpty(this.benchmarks)
      },
      courses () {
        return this.$store.state.courses.map(course => ({...course, name: course.number}))
      },
      ...mapState([BENCHMARK]),
      ...mapGetters({benchmarkLookup: 'benchmarkNameLookup', courseLookup: 'courseIdLookup'})
    }
  }
</script>
