<template>
  <graph :links="links" :nodes="nodes" :loaded="loaded" :clickedNode="clicked" :node-style="nodeStyle">
    <!--suppress JSUnresolvedVariable -->
    <template slot="drawer">

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

      <v-list two-line subheader>
        <v-subheader>Prerequisites</v-subheader>
        <v-list-tile v-for="prereq in selectedCourse.prereqs" @click="selected = prereq" :key="prereq">
          <v-list-tile-content>
            <v-list-tile-title>{{ prereq }}</v-list-tile-title>
            <v-list-tile-sub-title>{{ prereq.title || 'No Title' }}</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-subheader>Corequisites</v-subheader>
        <v-list-tile v-for="coreq in selectedCourse.coreqs" @click="selected = coreq" :key="coreq">
          <v-list-tile-content>
            <v-list-tile-title>{{ coreq }}</v-list-tile-title>
            <v-list-tile-sub-title>{{ coreq.title || 'No Title' }}</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>

      </v-list>
    </template>

    <v-toolbar dense floating class="j-toolbar">
      <v-text-field
        label="Filter"
        hide-details
        prepend-inner-icon="search"
        solo
        v-model="filter"
      ></v-text-field>
    </v-toolbar>

  </graph>
</template>

<!--suppress JSUnresolvedVariable -->
<script>
  import * as d3 from 'd3'
  import Graph from '@/components/Graph'

  export default {
    name: 'PrerequisiteGraph',
    components: {Graph},
    data () {
      return {
        parsed: [],
        options: {prereq: '#ffe800', coreq: 'green', post: '#ff4e41', none: 'grey', current: '#15abff'},
        filter: '',
        selected: null,
        loaded: false,
        nodeStyle: undefined
      }
    },
    methods: {
      clicked (clickedNode) {
        this.open = true
        d3.event.stopPropagation()
        this.selected = clickedNode.id  // id is the course name
      },
      dfs (course, key, option, states, start = true) {
        if (course === undefined) {
          return
        }

        // Have we already seen this node before?
        if (states[course.name] !== this.options.none) {
          // Only return if we are not at the start. We don't want to set the color as the start is set to 'current'
          if (!start) {
            return
          }
        } else {
          states[course.name] = option
        }

        for (const name of course[key] || []) {
          this.dfs(this.courseLookup[name], key, option, states, false)
        }
      }
    },
    created () {
      const that = this
      this.$store.dispatch('loadParsed').then(parsed => {
        that.parsed = parsed

        // add courses to the lookup
        for (const [i, course] of parsed.entries()) {
          course.index = i
        }

        const parsePrereqs = (root, node = root.prereqTree) => {
          if (node === null) {
            return
          }

          if (node.leaf) {
            const prereqName = node.value
            if (prereqName in that.courseLookup) {
              let prereq = that.courseLookup[prereqName]
              prereq.post = prereq.post || []
              prereq.post.push(root.name)
            }
            root.prereqs.push(prereqName)
          } else {
            if (node.value === 'and') {
              parsePrereqs(root, node.left)
              parsePrereqs(root, node.right)
            } else if (node.value === 'or') {
              parsePrereqs(root, node.left)
            } else {
              throw new Error(`Unknown node value: ${node.value}`)
            }
          }
        }

        const parseCoreqs = (root, node = root.coreqTree) => {
          if (node === null) {
            return
          }

          if (node.leaf) {
            const prereqName = node.value
            root.coreqs.push(prereqName)
          } else {
            if (node.value === 'and') {
              parsePrereqs(root, node.left)
              parsePrereqs(root, node.right)
            } else if (node.value === 'or') {
              parsePrereqs(root, node.left)
            } else {
              throw new Error(`Unknown node value: ${node.value}`)
            }
          }
        }

        for (let course of parsed) {
          course.prereqs = []
          parsePrereqs(course)

          course.coreqs = []
          parseCoreqs(course)
        }

        // Ok now we set loaded as true!
        that.loaded = true
      })
    },
    computed: {
      nodes () {
        return this.courses.map(course => ({id: course.name}))
      },
      links () {
        const links = []
        this.courses.map((course, index) => {
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
      },
      courses () {
        return this.parsed.filter(course => course.name.startsWith(this.filter))
      },
      courseLookup () {
        return this.courses.reduce((lookup, course) => { lookup[course.name] = course; return lookup }, {})
      },
      selectedCourse () {
        return this.courseLookup[this.selected] || {}
      }
    },
    watch: {
      nodes () {
        // force refresh
        this.loaded = false
        this.$nextTick(() => { this.loaded = true })
      },
      selectedCourse () {
        if (this._.isEmpty(this.selectedCourse)) {
          console.debug(`${this.selected} is not in the course lookup`)
          return
        }

        console.log(`Colorizing: ${this.selected}`)

        let states = {}

        // initialize each course to nothing
        for (const course of this.courses) {
          states[course.name] = this.options.none
        }

        // set the current course the `current`
        states[this.selectedCourse.name] = this.options.current

        this.dfs(this.selectedCourse, 'prereqs', this.options.prereq, states)
        this.dfs(this.selectedCourse, 'coreqs', this.options.coreq, states)
        this.dfs(this.selectedCourse, 'post', this.options.post, states)

        // noinspection JSUnusedGlobalSymbols
        this.nodeStyle = {fill: node => states[node.id]}
      }
    }
  }
</script>

<style scoped>
  .j-toolbar {
    z-index: 1;
    position: relative;
    left: 0;
    padding: 0;
    margin-top: 16px!important;
  }
</style>

<!--suppress CssUnusedSymbol -->
<style>
  .j-toolbar .v-toolbar__content {
    padding: 0;
  }
</style>
