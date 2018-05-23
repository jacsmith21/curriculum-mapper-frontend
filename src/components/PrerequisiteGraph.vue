<template>
  <v-container v-bind:style="{padding: 0}" fluid>
    <svg style="width:100%;height:100%;position:fixed;top:0;left:0;bottom:0;right:0;">
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
        settings: {
          strokeColor: '#29B5FF',
          width: 100,
          svgWigth: 960,
          svgHeight: 600
        },
        mounted: false,
        loaded: false,
        courses: null
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
      this.$store.dispatch('loadCourses').then(courses => {
        this.courses = courses
        this.loaded = true

        this.simulation = d3.forceSimulation(this.graph.nodes)
          .force('link', d3.forceLink(this.graph.links).distance(100).strength(0.1))
          .force('charge', d3.forceManyBody())
          .force('center', d3.forceCenter(this.settings.svgWigth / 2, this.settings.svgHeight / 2))

        this.mounted = true
      })
    },
    computed: {
      nodes () {
        const that = this
        if (this.mounted) {
          return d3.select('svg').append('g')
            .attr('class', 'nodes')
            .selectAll('circle')
            .data(that.graph.nodes)
            .enter()
            .append('circle')
            .attr('r', 20)
            .attr('fill', function (d, i) {
              return that.color(i)
            })
            .call(d3.drag()
              .on('start', d => {
                if (!d3.event.active) { that.simulation.alphaTarget(0.3).restart() }
                d.fx = d.x
                d.fy = d.y
              })
              .on('drag', d => {
                d.fx = d3.event.x
                d.fy = d3.event.y
              })
              .on('end', d => {
                if (!d3.event.active) { that.simulation.alphaTarget(0) }
                d.fx = null
                d.fy = null
              }))
        }
      },
      links () {
        const that = this
        if (this.mounted) {
          return d3.select('svg').append('g')
            .attr('class', 'links')
            .selectAll('line')
            .data(that.graph.links)
            .enter().append('line')
            .attr('stroke-width', () => { return Math.sqrt(5) })
            .style('stroke', '#ccc')
        }
      },
      graph () {
        if (!this.loaded) {
          return
        }

        const nodes = this.courses.map(course => { return {id: course.name} })
        const links = []
        this.courses.map((course, index) => {
          course.prerequisites.map(prerequisite => {
            links.push({source: index, target: this.courseIndexById(prerequisite)})
          })
        })
        console.log('asdfdsfasdfsdfsad')
        return {links: links, nodes: nodes}
      }
    },
    updated: function () {
      const that = this
      that.simulation.nodes(that.graph.nodes).on('tick', () => {
        that.links
          .attr('x1', function (d) { return d.source.x })
          .attr('y1', function (d) { return d.source.y })
          .attr('x2', function (d) { return d.target.x })
          .attr('y2', function (d) { return d.target.y })
        that.nodes
          .attr('cx', function (d) { return d.x })
          .attr('cy', function (d) { return d.y })
      })
    }
  }
</script>
