<template>
  <div style="height: 100%">
    <v-select
        v-model="projection"
        :items="projections"
        label="Method"
        required
    ></v-select>
    <div ref="container" style="height: 100%"></div>
  </div>
</template>

<script>
import * as druid from '@saehrimnir/druidjs'
import * as d3 from 'd3'

export default {
  name: 'Embedding',
  data: () => ({
    projection: 'PCA',
    projections: [
      'PCA',
      'MDS',
      't-SNE'
    ],

    // TODO: update id interactive
    id: 0,
    cached: {
      pca: null,
      mds: null,
      tsne: null
    },
    embedding: []
  }),
  methods: {
    drawChart (container, coordinates) {
      container.innerHTML = ''

      const width = Math.max(0, container.clientWidth)
      const height = Math.max(0, this.$parent.$el.clientWidth - 24)
      const max = Math.max(...coordinates.map(([x, y]) => Math.max(Math.abs(x), Math.abs(y))))
      const data = coordinates.map(([x, y]) => [(x + max) / (2 * max) * width, (y + max) / (2 * max) * height])

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
          // .attr('fill', i => d3.schemeCategory10[labels[i]])
          .attr('fill', i => 'steelblue')
          .attr('stroke-width', 0)
          .attr('stroke', 'blue')
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

      svg
          .call(d3.zoom()
              .scaleExtent([1, 8])
              .on('zoom', (event) => circles.attr('transform', transform(event.transform))))

      container.appendChild(svg.node())
    },
    computeCoordinates () {
      if (this.cached[this.projection.toLowerCase()]) {
        this.cached[this.projection.toLowerCase()] = this.cached[this.projection.toLowerCase()].slice(0) // trigger view update
        return
      }

      const transformation = new druid[this.projection.replaceAll('-','').toUpperCase()](this.embedding, { d: 2 })
      transformation.transform_async().then(result => {
        this.cached[this.projection.toLowerCase()] = result
      })
    }
  },
  computed: {
    coordinates () {
      console.log('recompute coordinates')

      if (this.cached[this.projection.toLowerCase()]) {
        this.$parent.$emit('loaded')
        return this.cached[this.projection.toLowerCase()]
      }

      this.$parent.$emit('loading')
      this.computeCoordinates()
      return []
    }
  },
  mounted () {
    let width = 0

    // HACK: resize event not working for some reason
    setInterval(() => {
      if (this.$refs.container && (this.$refs.container.clientWidth !== width || !width)) {
        this.drawChart(this.$refs.container, this.coordinates)
        width = this.$refs.container.clientWidth
      }
    }, 500)
  },
  watch: {
    projection () {
      this.drawChart(this.$refs.container, this.coordinates)
    }
  },
  created () {
    this.$parent.$emit('loading')

    this.$api.getEmbedding(this.id).then(embedding => {
      this.embedding = embedding

      // this.$parent.$emit('loaded')
    })
  }
}
</script>