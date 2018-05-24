<template>
  <v-container v-bind:style="{padding: 0}" fluid>
    <svg style="width:100%;height:100%;position:fixed;top:0;left:0;bottom:0;right:0;" ref="component">
      <g :id="links"></g>
      <g :id="nodes"></g>
    </svg>
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
        loaded: false
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
      }
    },
    created () {
      const that = this
      this.$store.dispatch('loadCourses').then(courses => {
        that.courses = courses
        that.loaded = true

        let simulation = d3.forceSimulation(that.nodes)
          .force('link', d3.forceLink(that.links).distance(100).strength(0.1))
          .force('charge', d3.forceManyBody())
          .force('center', d3.forceCenter(this.width / 2, this.height / 2))

        const svg = d3.select('svg')

        svg.append('svg:defs').selectAll('marker')
          .data(['end'])      // Different link/path types can be defined here
          .enter().append('svg:marker')    // This section adds in the arrows
          .attr('id', String)
          .attr('viewBox', '0 -5 10 10')
          .attr('refX', 15)
          .attr('refY', -1.5)
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

        const node = svg.append('g')
          .attr('class', 'nodes')
          .selectAll('circle')
          .data(that.nodes)
          .enter().append('circle')
          .attr('r', 10)
          .attr('fill', (_, i) => that.color(i))
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

        const label = svg.append('g')
          .attr('class', 'text')
          .selectAll('text')
          .data(that.nodes).enter()
          .append('text')
          .text(node => node.id)
          .style('text-anchor', 'middle')
          .style('fill', '#000')
          .style('font-size', 15)

        simulation.nodes(that.nodes).on('tick', () => {
          link
            .attr('x1', link => link.source.x)
            .attr('y1', link => link.source.y)
            .attr('x2', link => link.target.x)
            .attr('y2', link => link.target.y)
          node
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

<style scoped>
  .node text {
    pointer-events: none;
    font: 10px sans-serif;
  }
</style>
