<template>
  <v-container>
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

      <v-list two-line subheader>
        <v-subheader>Prerequisites</v-subheader>
        <v-list-tile v-for="prereq in selectedCourse.prereqs" @click="() => colorize(prereq)" :key="prereq">
          <v-list-tile-content>
            <v-list-tile-title>{{ prereq }}</v-list-tile-title>
            <v-list-tile-sub-title>{{ prereq.title || 'No Title' }}</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-subheader>Corequisites</v-subheader>
        <v-list-tile v-for="coreq in selectedCourse.coreqs" @click="() => colorize(coreq)" :key="coreq">
          <v-list-tile-content>
            <v-list-tile-title>{{ coreq }}</v-list-tile-title>
            <v-list-tile-sub-title>{{ coreq.title || 'No Title' }}</v-list-tile-sub-title>
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
    name: 'PrerequisiteGraph',
    components: {Toolbar},
    mixins: [graph],
    data () {
      return {
        parsed: null,
        courseLookup: {},
        selectedCourse: {}
      }
    },
    methods: {
      clicked (clickedNode) {
        this.open = true

        d3.event.stopPropagation()
        this.colorize(clickedNode.id)
      },
      colorize (name) {
        if (!(name in this.courseLookup)) {
          return
        }

        console.log(`Colorizing: ${name}`)

        const options = {prereq: '#ffe800', coreq: 'green', post: '#ff4e41', none: 'grey', current: '#15abff'}
        let states = {}

        // initialize each course to nothing
        for (const course of this.parsed) {
          states[course.name] = options.none
        }

        const dfs = (course, key, option, notStart) => {
          if (course === undefined) {
            return
          }

          // Have we already seen this node before?
          if (states[course.name] !== options.none) {
            // Only return if we are not at the start. We don't want to set the color as the start is set to 'current'
            if (notStart) {
              return
            }
          } else {
            states[course.name] = option
          }

          for (const id of course[key] || []) {
            dfs(this.courseLookup[id], key, option, true)
          }
        }

        this.selectedCourse = this.courseLookup[name]
        states[this.selectedCourse.name] = options.current
        dfs(this.selectedCourse, 'prereqs', options.prereq)
        dfs(this.selectedCourse, 'coreqs', options.coreq)
        dfs(this.selectedCourse, 'post', options.post)

        this.node.style('fill', node => states[node.id])
      }
    },
    created () {
      const that = this
      this.$store.dispatch('loadParsed').then(parsed => {
        console.info(parsed)
        that.parsed = parsed

        // add courses to the lookup
        for (const [i, course] of parsed.entries()) {
          that.courseLookup[course.name] = course
          course.index = i
        }

        // TODO: Save information
        const parsePrereqs = (root, node = root.prereqTree) => {
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

        const parse = (root, prop, node = root.coreqTree) => {
          if (node.leaf) {
            const prereqName = node.value
            root[prop].push(prereqName)
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

        // Ok now we set loaded as true!
        that.loaded = true

        for (let course of parsed) {
          course.prereqs = []
          parsePrereqs(course)

          course.coreqs = []
          parse(course, 'coreqs')
        }

        that.initiate()
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
