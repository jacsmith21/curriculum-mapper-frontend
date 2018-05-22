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
        graph: null,
        simulation: null,
        color: d3.scaleOrdinal(d3.schemeCategory10),
        settings: {
          strokeColor: '#29B5FF',
          width: 100,
          svgWigth: 960,
          svgHeight: 600
        },
        forceData: {
          'nodes': [
            {
              'id': 'Alice'
            },
            {
              'id': 'Bob'
            },
            {
              'id': 'Carol'
            }
          ],
          'links': [
            {
              'source': 0,
              'target': 1
            },
            {
              'source': 1,
              'target': 2
            }
          ]
        }
      }
    },
    created () {
      this.$store.dispatch('loadCourses')
    },
    mounted: function () {
      const that = this
      console.log('mounted')
      that.graph = this.forceData
      that.simulation = d3.forceSimulation(that.graph.nodes)
        .force('link', d3.forceLink(that.graph.links).distance(100).strength(0.1))
        .force('charge', d3.forceManyBody())
        .force('center', d3.forceCenter(that.settings.svgWigth / 2, that.settings.svgHeight / 2))
    },
    computed: {
      nodes: function () {
        const that = this
        if (that.graph) {
          return d3.select('svg').append('g')
            .attr('class', 'nodes')
            .selectAll('circle')
            .data(that.graph.nodes)
            .enter().append('circle')
            .attr('r', 20)
            .attr('fill', function (d, i) {
              return that.color(i)
            })
            .call(d3.drag()
              .on('start', function dragstarted (d) {
                if (!d3.event.active) that.simulation.alphaTarget(0.3).restart()
                d.fx = d.x
                d.fy = d.y
              })
              .on('drag', function dragged (d) {
                d.fx = d3.event.x
                d.fy = d3.event.y
              })
              .on('end', function dragended (d) {
                if (!d3.event.active) that.simulation.alphaTarget(0)
                d.fx = null
                d.fy = null
              }))
        }
      },
      links: function () {
        const that = this
        if (that.graph) {
          return d3.select('svg').append('g')
            .attr('class', 'links')
            .selectAll('line')
            .data(that.graph.links)
            .enter().append('line')
            .attr('stroke-width', function (d) { return Math.sqrt(5) })
            .style('stroke', '#ccc')
        }
      }
    },
    updated: function () {
      const that = this
      that.simulation.nodes(that.graph.nodes).on('tick', function ticked () {
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
