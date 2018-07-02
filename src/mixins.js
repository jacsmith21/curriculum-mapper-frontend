import * as d3 from 'd3'
import { add, sub, radiusVector } from '@/components/vector'

export const vmodel = {
  props: ['value'],
  data () {
    return {
      content: this.value
    }
  },
  methods: {
    input () {
      this.$emit('input', this.content)
    }
  }
}

export const graph = {
  data () {
    return {
      loaded: false,
      canvas: null,
      color: d3.scaleOrdinal(d3.schemeCategory10),
      width: window.innerWidth,
      height: window.innerHeight - 64 - 32,
      radius: 15,
      fontSize: 15,
      open: false,
      node: null,
      link: null,
      text: null
    }
  },
  methods: {
    initiate () {
      if (!this.loaded) {
        throw new Error('loaded must be set to `true` before `initiate` can be called!')
      }

      let simulation = d3.forceSimulation(this.nodes)
        .force('link', d3.forceLink(this.links).distance(100).strength(0.1))
        .force('charge', d3.forceManyBody().strength(-140).distanceMax(150).distanceMin(5))
        .force('center', d3.forceCenter(this.width / 2, this.height / 2))

      const svg = d3.select('svg')

      svg.append('svg:defs').selectAll('marker')
        .data(['end'])  // Different link/path types can be defined here
        .enter().append('svg:marker')  // This section adds in the arrows
        .attr('id', String)
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 10)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('svg:path')
        .attr('d', 'M0,-5L10,0L0,5')

      this.link = svg.append('g')
        .attr('class', 'links')
        .selectAll('line')
        .data(this.links)
        .enter().append('line')
        .attr('stroke-width', () => { return Math.sqrt(5) })
        .style('stroke', '#ccc')
        .attr('marker-end', 'url(#end)')

      this.node = svg.append('g')
        .attr('class', 'nodes')
        .selectAll('circle')
        .data(this.nodes)
        .enter().append('circle')
        .attr('r', this.radius)
        .attr('fill', (_, i) => this.color(i))
        .on('mousedown', this.clicked)
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

      this.label = svg.append('g')
        .attr('class', 'text')
        .selectAll('text')
        .data(this.nodes).enter()
        .append('text')
        .text(node => node.id)
        .style('text-anchor', 'middle')
        .style('fill', '#000')
        .style('font-size', this.fontSize)
        .attr('dy', 6)
        .attr('class', 'unselectable')
        .attr('dx', text => this.getTextWidth(text.id, `${Math.min(this.fontSize, this.radius * 2)}pt Roboto`) / 2 + 10)

      simulation.nodes(this.nodes).on('tick', () => {
        this.link
          .attr('x1', link => add(link.source, radiusVector(link, this.radius)).x, this.radius)
          .attr('y1', link => add(link.source, radiusVector(link, this.radius)).y, this.radius)
          .attr('x2', link => sub(link.target, radiusVector(link, this.radius)).x, this.radius)
          .attr('y2', link => sub(link.target, radiusVector(link, this.radius)).y, this.radius)
        this.node
          .attr('cx', node => Math.max(this.radius, Math.min(this.width - this.radius, node.x)))
          .attr('cy', node => Math.max(64 + this.radius, Math.min(64 + this.height - this.radius, node.y)))
        this.label
          .attr('x', label => label.x)
          .attr('y', label => label.y)
      })
    },
    getTextWidth (text, font) {
      // re-use canvas object for better performance
      let canvas = this.canvas || (this.canvas = document.createElement('canvas'))
      let context = canvas.getContext('2d')
      context.font = font
      let metrics = context.measureText(text)
      return metrics.width
    }
  },
  mounted () {
    window.addEventListener('resize', () => {
      this.width = window.innerWidth
      this.height = window.innerWidth - 64 - 32
    })
    // this.$emit('resize') TODO: use this
  }
}
