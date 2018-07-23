<template>
  <v-container class="container" fluid>
    <svg>
      <g id="links"></g>
      <g id="nodes"></g>
    </svg>
  </v-container>
</template>

<script>
  import * as d3 from 'd3'
  import JGraph from '@/components/JGraph'
  import miserable from '@/miserable'

  const ordinalScale = d3.scaleOrdinal(d3.schemeCategory10)

  export default {
    name: 'Grouping',
    components: {JGraph},
    data () {
      return {
        net: {},
        expand: {}, // expanded clusters,
        curve: d3.line().curve(d3.curveCardinalClosed.tension(0.85)),
        hullOffset: 15,
        width: window.innerWidth,
        height: window.innerHeight - 64 - 32,
        node: null,
        link: null,
        hull: null,
        radius: 4,
        data: miserable
      }
    },
    methods: {
      renderGroups () {
        if (this.force) this.force.stop()
        this.net = this.network()

        let simulation = d3.forceSimulation(this.net.nodes)
          .force('link', d3.forceLink(this.net.links).distance(l => {
            // eslint-disable-next-line
            let n1 = l.source, n2 = l.target

            // larger distance for bigger groups:
            // both between single nodes and _other_ groups (where size of own node group still counts),
            // and between two group nodes.
            //
            // reduce distance for groups with very few outer links,
            // again both in expanded and grouped form, i.e. between individual nodes of a group and
            // nodes of another group or other group node or between two group nodes.
            //
            // The latter was done to keep the single-link groups ('blue', rose, ...) close.
            // noinspection JSUnresolvedVariable
            return 30 +
              Math.min(
                20 * Math.min((n1.size || (n1.group !== n2.group ? n1.group_data.size : 0)), (n2.size || (n1.group !== n2.group ? n2.group_data.size : 0))),
                -30 + 30 * Math.min((n1.link_count || (n1.group !== n2.group ? n1.group_data.link_count : 0)), (n2.link_count || (n1.group !== n2.group ? n2.group_data.link_count : 0))),
                100
              )
          }).strength(0.1)) // TODO: Using function to compute distance
          .force('charge', d3.forceManyBody().strength(-140).distanceMax(150).distanceMin(5))
          .force('center', d3.forceCenter(this.width / 2, this.height / 2))

        const svg = d3.select('svg')
          .style('z-index', 0)

        svg.selectAll('*').remove()

        this.hull = svg.append('g')
          .attr('class', 'hulls')
          .selectAll('path')
          .data(this.convexHulls())
          .enter().append('path')
          .attr('class', 'hull')
          .attr('d', d => this.curve(d.path))
          .style('fill', this.fill)
          .on('click', d => {
            console.log('hull click', d, arguments, this, this.expand[d.group])
            this.expand[d.group] = false
            this.renderGroups()
          })

        this.link = svg.append('g')
          .attr('class', 'links')
          .selectAll('line')
          .data(this.net.links, this.linkid)
          .enter().append('line')
          .attr('class', 'link')
          .style('stroke-width', d => d.size || 1)

        this.node = svg.append('g')
          .attr('class', 'nodes')
          .selectAll('circle')
          .data(this.net.nodes, this.nodeid)
          .enter().append('circle')
          .attr('class', d => 'node' + (d.size ? '' : ' leaf'))
          .attr('r', d => d.size ? d.size + this.radius : this.radius + 1)
          .style('fill', this.fill)
          .on('click', node => {
            console.log('node click', node, arguments, this, this.expand[node.group])
            this.expand[node.group] = true
            this.renderGroups()
          })
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

        simulation.nodes(this.net.nodes).on('tick', () => {
          if (!this.hull.empty()) {
            this.hull
              .data(this.convexHulls())
              .attr('d', d => this.curve(d.path))
          }

          this.link
            .attr('x1', link => link.source.x)
            .attr('y1', link => link.source.y)
            .attr('x2', link => link.target.x)
            .attr('y2', link => link.target.y)
          this.node
            .attr('cx', node => node.x)
            .attr('cy', node => node.y)
        })
      },
      network () {
        // eslint-disable-next-line
        let gm = {},   // group map
          nm = {},     // node map
          lm = {},     // link map
          gn = {},     // previous group nodes
          gc = {},     // previous group centroids
          nodes = [],  // output nodes
          links = []   // output links

        // process previous nodes for reuse or centroid calculation
        if (!this._.isEmpty(this.net)) {
          this.net.nodes.filter(n => n.size).map(n => {
            gn[n.group] = n
            n.size = 0
          })
        }

        // determine nodes
        this.data.nodes.map(n => {
          let group = gm[n.group] || (gm[n.group] = gn[n.group]) || (gm[n.group] = {group: n.group, size: 0, nodes: []})

          if (this.expand[n.group]) {
            // the node should be directly visible
            nm[n.name] = nodes.length
            nodes.push(n)
            if (gn[n.group]) {
              // place new nodes at cluster location (plus jitter)
              n.x = gn[n.group].x + Math.random()
              n.y = gn[n.group].y + Math.random()
            }
          } else {
            // the node is part of a collapsed cluster
            if (group.size === 0) {
              // if new cluster, add to set and position at centroid of leaf nodes
              nm[n.group] = nodes.length
              nodes.push(group)
              if (gc[n.group]) {
                group.x = gc[n.group].x / gc[n.group].count
                group.y = gc[n.group].y / gc[n.group].count
              }
            }
            group.nodes.push(n)
          }
          // always count group size as we also use it to tweak the force graph strengths/distances
          group.size += 1
          n.group_data = group
        })

        for (const i of Object.keys(gm)) { gm[i].link_count = 0 }

        // determine links
        this.data.links.map(e => {
          // eslint-disable-next-line
          let sg = e.source.group, tg = e.target.group
          if (sg !== tg) {
            // noinspection JSUnresolvedVariable
            gm[sg].link_count++
            // noinspection JSUnresolvedVariable
            gm[tg].link_count++
          }
          sg = this.expand[sg] ? nm[e.source.name] : nm[sg]
          tg = this.expand[tg] ? nm[e.target.name] : nm[tg]
          // eslint-disable-next-line
          let i = (sg < tg ? sg + '|' + tg : tg + '|' + sg),
            l = lm[i] || (lm[i] = {source: sg, target: tg, size: 0})
          l.size += 1
        })

        for (const i of Object.keys(lm)) { links.push(lm[i]) }

        return {nodes: nodes, links: links}
      },
      fill (d) {
        return ordinalScale(d.group)
      },
      nodeid (n) {
        return n.size ? '_g_' + n.group : n.name
      },
      linkid (l) {
        // eslint-disable-next-line
        let u = this.nodeid(l.source), v = this.nodeid(l.target)
        return u < v ? u + '|' + v : v + '|' + u
      },
      convexHulls () {
        let hulls = {}
        let offset = this.hullOffset

        // create point sets
        this.net.nodes.filter(n => !n.size).map(n => {
          // eslint-disable-next-line
          let i = n.group, l = hulls[i] || (hulls[i] = [])
          l.push([n.x - offset, n.y - offset])
          l.push([n.x - offset, n.y + offset])
          l.push([n.x + offset, n.y - offset])
          l.push([n.x + offset, n.y + offset])
        })

        // create convex hulls
        const hullset = []
        for (const i of Object.keys(hulls)) {
          hullset.push({group: i, path: d3.polygonHull(hulls[i])})
        }

        return hullset
      }
    },
    mounted () {
      this.data.links.map(link => {
        link.source = miserable.nodes[link.source]
        link.target = miserable.nodes[link.target]
      })
      this.renderGroups()
    }
  }
</script>

<style scoped>
  .container {
    padding: 0;
  }

  svg {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 1px solid #ccc
  }
</style>

<!--TODO: Make this scoped-->
<!--suppress CssUnusedSymbol -->
<style>
  circle.node {
    fill: lightsteelblue;
    stroke: #555;
    stroke-width: 3px
  }

  circle.leaf {
    stroke: #fff;
    stroke-width: 2px
  }

  path.hull {
    fill: lightsteelblue;
    fill-opacity: 0.3
  }

  line.link {
    stroke: #333;
    stroke-opacity: 0.5;
    pointer-events: none
  }


</style>
