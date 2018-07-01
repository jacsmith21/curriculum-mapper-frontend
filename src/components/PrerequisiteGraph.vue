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

      <v-list two-line subheader>

        <v-btn-toggle v-model="toggle_one" mandatory>
          <v-btn flat>
            Left
          </v-btn>
          <v-btn flat>
            Center
          </v-btn>
          <v-btn flat>
            Right
          </v-btn>
          <v-btn flat>
            Justify
          </v-btn>
        </v-btn-toggle>

        <v-subheader>Prerequisites</v-subheader>
        <v-list-tile v-for="prereq in selectedCourse.prereqs" @click="() => colorize(prereq)" :key="prereq">
          <v-list-tile-content>
            <v-list-tile-title>{{ prereq }}</v-list-tile-title>
            <v-list-tile-sub-title>{{ prereq.title || 'No Title' }}</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>

        <!--<v-subheader>Corequisites</v-subheader>-->
        <!--<v-list-tile v-for="corequisite in get(selectedCourse, 'corequisites')" @click="() => colorize(corequisite.name)" :key="corequisite._id">-->
          <!--<v-list-tile-content>-->
            <!--<v-list-tile-title>{{ corequisite.name }}</v-list-tile-title>-->
            <!--<v-list-tile-sub-title>{{ corequisite.title || 'No Title' }}</v-list-tile-sub-title>-->
          <!--</v-list-tile-content>-->
        <!--</v-list-tile>-->

      </v-list>
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
  import { add, sub, radiusVector } from '@/components/vector'
  import Toolbar from '@/components/Toolbar'

  export default {
    name: 'PrerequisiteGraph',
    components: {Toolbar},
    data () {
      return {
        simulation: null,
        color: d3.scaleOrdinal(d3.schemeCategory10),
        parsed: null,
        courseLookup: {},
        loaded: false,
        radius: 15,
        fontSize: 15,
        node: null,
        open: false,
        selectedCourse: {},
        width: window.innerWidth,
        height: window.innerHeight - 64 - 32,
        toggle_one: 0
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
      },
      get (course, key) {
        if (this._.isEmpty(course)) {
          return []
        }

        const items = course[key] || []
        return items.map(prereq => {
          if (prereq in this.courseLookup) {
            return this.courseLookup[prereq]
          } else {
            return prereq
          }
        })
      }
    },
    created () {
      console.debug(this.$refs)

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

        let simulation = d3.forceSimulation(that.nodes)
          .force('link', d3.forceLink(that.links).distance(100).strength(0.1))
          .force('charge', d3.forceManyBody().strength(-140).distanceMax(150).distanceMin(5))
          .force('center', d3.forceCenter(this.width / 2, this.height / 2))

        const svg = d3.select('svg')

        svg.append('svg:defs').selectAll('marker')
          .data(['end'])      // Different link/path types can be defined here
          .enter().append('svg:marker')    // This section adds in the arrows
          .attr('id', String)
          .attr('viewBox', '0 -5 10 10')
          .attr('refX', 10)
          .attr('refY', 0)
          .attr('markerWidth', 6)
          .attr('markerHeight', 6)
          .attr('orient', 'auto')
          .append('svg:path')
          .attr('d', 'M0,-5L10,0L0,5')

        const link = svg.append('g')
          .attr('class', 'links')
          .selectAll('line')
          .data(that.links)
          .enter().append('line')
          .attr('stroke-width', () => { return Math.sqrt(5) })
          .style('stroke', '#ccc')
          .attr('marker-end', 'url(#end)')

        that.node = svg.append('g')
          .attr('class', 'nodes')
          .selectAll('circle')
          .data(that.nodes)
          .enter().append('circle')
          .attr('r', that.radius)
          .attr('fill', (_, i) => that.color(i))
          .on('mousedown', that.clicked)
          .call(d3.drag()
            .on('start', d => {
              if (!d3.event.active) { simulation.alphaTarget(0.3).restart() }
              d.fx = d.x
              d.fy = d.y
            }).on('drag', d => {
              d.fx = d3.event.x
              d.fy = d3.event.y
            })
            .on('end', d => {
              if (!d3.event.active) { simulation.alphaTarget(0) }
              d.fx = null
              d.fy = null
            }))

        let getTextWidth = (text, font) => {
          // re-use canvas object for better performance
          let canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement('canvas'))
          let context = canvas.getContext('2d')
          context.font = font
          let metrics = context.measureText(text)
          return metrics.width
        }

        const label = svg.append('g')
          .attr('class', 'text')
          .selectAll('text')
          .data(that.nodes).enter()
          .append('text')
          .text(node => node.id)
          .style('text-anchor', 'middle')
          .style('fill', '#000')
          .style('font-size', this.fontSize)
          .attr('dy', 6)
          .attr('class', 'unselectable')
          .attr('dx', text => getTextWidth(text.id, `${Math.min(this.fontSize, this.radius * 2)}pt Roboto`) / 2 + 10)

        simulation.nodes(that.nodes).on('tick', () => {
          link
            .attr('x1', link => add(link.source, radiusVector(link, this.radius)).x, this.radius)
            .attr('y1', link => add(link.source, radiusVector(link, this.radius)).y, this.radius)
            .attr('x2', link => sub(link.target, radiusVector(link, this.radius)).x, this.radius)
            .attr('y2', link => sub(link.target, radiusVector(link, this.radius)).y, this.radius)
          that.node
            .attr('cx', node => Math.max(this.radius, Math.min(this.width - this.radius, node.x)))
            .attr('cy', node => Math.max(64 + this.radius, Math.min(64 + this.height - this.radius, node.y)))
          label
            .attr('x', label => label.x)
            .attr('y', label => label.y)
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
        })

        return links
      },
      options () {
        if (this._.isEmpty(this.selectedCourse)) {
          return []
        }
        // TODO: Finish this
      }
    },
    mounted () {
      window.addEventListener('resize', () => {
        this.width = window.innerWidth
        this.height = window.innerWidth - 64 - 32
      })
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
