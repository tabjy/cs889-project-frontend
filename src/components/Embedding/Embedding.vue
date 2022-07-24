<template>
  <div style="margin-bottom: -38px;">
    <div style="display: inline-flex; width: 100%">
      <v-select
          v-model="projection"
          :items="projections"
          label="Method"
          required
      ></v-select>
      <div style="padding-left: 4px; padding-right: 4px">
        <v-switch
            v-model="graph"
            label="Graph"
            style="height: 24px; margin-top: -12px;"
        ></v-switch>
        <v-switch
            v-model="color"
            label="Colorized"
            style="height: 24px"
        ></v-switch>
      </div>
    </div>
  </div>

  <div style="height: calc(100% - 56px); display: flex; overflow: hidden">
    <div v-if="embeddings === null || coordinates === null" style="margin: auto;">
      <div v-if="embeddings === null">
        <p class="text-caption">Click an instance to view embeddings</p>
      </div>

      <div v-if="coordinates === null && embeddings !== null" class="text-center"
           style="margin-top: auto; margin-bottom: auto; width: 100%">
        <v-progress-circular
            indeterminate="true"
            color="primary"
        ></v-progress-circular>
      </div>
    </div>

    <div ref="container" style="width: 100%; height: 100%" :style="{display: !coordinates ? 'none' : undefined}">
    </div>
    <div v-if="coordinates && color" style="position: absolute;top: 100%;transform: translate(0, -100%);margin-top: -16px;">
      <ul style="padding-left: 16px">
        <li v-for="(name, i) in legend" :style="{color: swatch[i % swatch.length], height: '12px'}" class="text-caption">{{ name }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import * as druid from '@saehrimnir/druidjs'
import * as d3 from 'd3'

import { reverselyMapIds, getTagType } from '../../utils/ast'

export default {
  name: 'Embedding',
  props: {
    embeddings: Object,
    ast: XMLDocument
  },
  data: () => ({
    projection: 'PCA',
    projections: [
      'PCA',
      'MDS',
      't-SNE'
    ],
    coordinates: null,

    graph: true,
    color: true,
    dimension: 2,

    idMaps: null,
    swatch: d3.schemeCategory10,
    legend: ['comments', 'literals', 'names', 'statements', 'sub-statements', 'declarations', 'types', 'expressions', 'other']
  }),
  methods: {
    drawChart () {
      console.log(this.coordinates.map(i => i))
      console.log(this.idMaps.entries())

      this.$refs.container.innerHTML = ''

      if (!this.coordinates) {
        return
      }

      if (!this.$refs.container.clientWidth || !this.$refs.container.clientHeight) {
        setTimeout(() => this.drawChart(), 0) // HACK: wait for DOM to layout
        return
      }

      const width = this.$refs.container.clientWidth
      const height = this.$refs.container.clientHeight
      const max = Math.max(...this.coordinates.map(([x, y]) => Math.max(Math.abs(x), Math.abs(y)))) * 1.05

      const data = this.coordinates
          .slice(0, this.graph ? this.idMaps.nodes.size : this.idMaps.sequences.size)
          .map(([x, y]) => [(x + max) / (2 * max) * width, (y + max) / (2 * max) * height])
      const svg = d3.create('svg')
          .attr('width', width)
          .attr('height', height)

      function transform (t) {
        return function (i) {
          return 'translate(' + t.apply(data[i]) + ')'
        }
      }

      const defaultRadius = 3
      const focusedRadius = 8

      const circles = svg.append('g')
          .selectAll('circle')
          .data(d3.range(data.length))
          .enter()
          .append('circle')
          .attr('r', defaultRadius)
          .attr('fill', i => {
            if (!this.color) {
              return 'steelblue'
            }

            if (this.graph) {
              const node = this.idMaps.nodes.get(i + '')
              return this.swatch[getTagType(node.nodeName) % this.swatch.length]
            } else {
              const node = this.idMaps.sequences.get(i + '')
              return this.swatch[getTagType(node.parentNode.nodeName) % this.swatch.length]
            }
          })
          // .attr('fill', i => 'steelblue')
          .attr('stroke-width', 0)
          // .attr('stroke', 'blue')
          .attr('transform', transform(d3.zoomIdentity))
          .attr('class', i => `data-${i}`)
          .on('mouseover', function (e, i) {
            d3.selectAll(`circle.data-${i}`)
                .attr('r', focusedRadius)
                .attr('stroke-width', 2)

            // bring the high lighted node to the front
            d3.selectAll(`circle.data-${i}`).nodes().forEach(node => {
              const parent = node.parentNode
              parent.removeChild(node)
              parent.appendChild(node)
            })
          })
          .on('mouseout', function (e, i) {
            d3.selectAll(`circle.data-${i}`)
                .attr('r', defaultRadius)
                .attr('stroke-width', 0)
          })
          .append('title')
          .text((i) => {
            const node = this.graph ? this.idMaps.nodes.get(i + '') : this.idMaps.sequences.get(i + '')
            return node.textContent
          });

      svg
          .call(d3.zoom()
              .scaleExtent([1, 8])
              .on('zoom', (event) => circles.attr('transform', transform(event.transform))))


      this.$refs.container.appendChild(svg.node())
    },
    computeCoordinates () {
      const key = this.projection.toLowerCase().replaceAll('-', '')

      this.coordinates = null

      const transformation = new druid[key.toUpperCase()](this.embeddings[this.graph ? 'nodes' : 'sequences'], { d: this.dimension })
      Promise.all([transformation.transform_async(), new Promise(resolve => setTimeout(resolve, 100))]).then(([result]) => {
        this.coordinates = result
      })
    },
  },
  watch: {
    projection () {
      if (this.embeddings) {
        this.computeCoordinates()
      }
    },
    graph () {
      if (this.embeddings) {
        this.computeCoordinates()
      }
    },
    color () {
      if (this.embeddings) {
        this.computeCoordinates()
      }
    },
    embeddings () {
      this.coordinates = null

      this.computeCoordinates()
    },
    ast () {
      this.idMaps = reverselyMapIds(this.ast)
    },
    coordinates () {
      this.drawChart()
    },
  },
  mounted () {
    const observer = new ResizeObserver(() => {
      this.drawChart()
    })

    observer.observe(this.$refs.container)
  }
}
</script>