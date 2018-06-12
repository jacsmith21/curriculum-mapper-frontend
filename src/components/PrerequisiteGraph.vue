<template>
  <v-container>

  <v-container v-bind:style="{padding: 0}" fluid @click="open = false">
    <svg style="width:100%;height:100%;position:fixed;top:0;left:0;bottom:0;right:0;" ref="component">
      <g :id="links"></g>
      <g :id="nodes"></g>
    </svg>
  </v-container>

  <v-navigation-drawer temporary v-model="open" fixed right hide-overlay>
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
    <v-list three-line subheader>
      <v-subheader>Prerequisites</v-subheader>
      <v-list-tile v-for="prerequisite in getPrerequisites(selectedCourse)" :to="`/courses/${prerequisite.name}`">
        <v-list-tile-content>
          <v-list-tile-title>{{ prerequisite.name }}</v-list-tile-title>
          <v-list-tile-sub-title>{{ prerequisite.title || 'No Title' }}</v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-navigation-drawer>

  </v-container>
</template>

<script>
  import * as d3 from 'd3'

  export default {
    name: 'PrerequisiteGraph',
    data () {
      return {
        simulation: null,
        color: d3.scaleOrdinal(d3.schemeCategory10),
        courses: null,
        courseLookup: {},
        loaded: false,
        radius: 15,
        fontSize: 15,
        node: null,
        open: false,
        selectedCourse: {}
      }
    },
    methods: {
      courseIndexById (id) {
        const courses = this.$store.state.courses
        for (let i = 0; i < courses.length; i++) {
          if (courses[i]._id === id) {
            return i
          }
        }
      },
      clicked (clickedNode) {
        console.log(`Clicked on ${clickedNode.id}`)
        this.open = true

        d3.event.stopPropagation()
        const options = {prereq: 'yellow', post: 'red', none: 'grey', current: 'blue'}
        let states = {}

        // initialize to nothing
        for (const course of this.courses) {
          states[course.name] = options.none
        }

        const set = (course, key, option, start) => {
          if (course === undefined) {
            return
          }

          if (!start) {
            states[course.name] = option
          }

          for (const id of course[key] || []) {
            let c = this.courseLookup[id]
            set(c, key, option, false)
          }
        }

        this.selectedCourse = this.courses.filter(course => course.name === clickedNode.id)[0]
        states[this.selectedCourse.name] = options.current
        set(this.selectedCourse, 'prerequisites', options.prereq, true)
        set(this.selectedCourse, 'post', options.post, true)

        console.log(`The final states:`)
        console.log(states)
        console.log(this.courses)
        this.node.style('fill', node => states[node.id])
      },
      normalize (vector) {
        return this.div(vector, this.length(vector))
      },
      length ({ x, y }) {
        return Math.sqrt(x * x + y * y)
      },
      div ({ x, y }, scalar) {
        return {x: x / scalar, y: y / scalar}
      },
      add ({x: x1, y: y1}, {x: x2, y: y2}) {
        return {x: x1 + x2, y: y1 + y2}
      },
      sub ({x: x1, y: y1}, {x: x2, y: y2}) {
        return {x: x1 - x2, y: y1 - y2}
      },
      scale (vector, scalar) {
        return this.prod(this.normalize(vector), scalar)
      },
      prod ({x, y}, scalar) {
        return {x: x * scalar, y: y * scalar}
      },
      radiusVector (link) {
        return this.scale(this.sub(link.target, link.source), this.radius)
      },
      getPrerequisites (course) {
        const prerequisites = course.prerequisites || []
        return prerequisites.map(id => this.courseLookup[id])
      }
    },
    created () {
      const that = this
      this.$store.dispatch('loadCourses').then(courses => {
        that.courses = courses
        that.loaded = true

        // add courses to the lookup
        for (const course of courses) {
          that.courseLookup[course._id] = course
        }

        for (const course of courses) {
          for (const id of course.prerequisites) {
            let prereq = this.courseLookup[id]
            prereq.post = prereq.post || []
            prereq.post.push(course._id)
          }
        }

        let simulation = d3.forceSimulation(that.nodes)
          .force('link', d3.forceLink(that.links).distance(100).strength(0.1))
          .force('charge', d3.forceManyBody().strength(-140).distanceMax(300).distanceMin(5))
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
            .attr('x1', link => this.add(link.source, this.radiusVector(link)).x) // computes the edge of the circle
            .attr('y1', link => this.add(link.source, this.radiusVector(link)).y)
            .attr('x2', link => this.sub(link.target, this.radiusVector(link)).x)
            .attr('y2', link => this.sub(link.target, this.radiusVector(link)).y)
          that.node
            .attr('cx', node => node.x)
            .attr('cy', node => node.y)
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
        return this.courses.map(course => { return {id: course.name} })
      },
      links () {
        if (!this.loaded) {
          return
        }
        const links = []
        this.courses.map((course, index) => {
          course.prerequisites.map(prerequisite => {
            const target = this.courseIndexById(prerequisite)
            if (target === undefined) {
              throw new Error('Target is not defined')
            }
            links.push({source: target, target: index})
          })
        })
        return links
      },
      height () {
        return this.$refs.component.clientHeight
      },
      width () {
        return this.$refs.component.clientWidth
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
