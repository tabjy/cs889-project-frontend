<template>
  <div style="padding: 8px; height: 100%">
    <div ref="summary" style="display: inline-flex">
      <v-chip v-for="(token, i) in summaryTokens" @mouseover="setActiveLinks({from: i})" @mouseout="resetActiveLinks()" style="margin-right: 8px">{{ token }}</v-chip>
    </div>

    <div ref="container"></div>

    <div ref="sources" style="display: inline-flex">
      <v-chip v-for="(source, i) in sources[type]" @mouseover="setActiveLinks({to: i})" @mouseout="resetActiveLinks()" style="margin-right: 8px">{{ source }}</v-chip>
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3'

export default {
  name: 'Attention',
  data: () => ({
    // TODO: set id interactively
    id: 0,
    summaryTokens: [],
    type: 'sequences',
    sources: {
      sequences: [],
      nodes: [],
    },
    attentions: {
      sequences: [/* [] */],
      nodes: [/* [] */]
    },
    svg: null
  }),
  methods: {
    idToSequence (id) {
      // TODO: compute from AST

    },

    idToNode (id) {
      // TODO: compute from AST
    },

    idToSummaryToken (id) {
      // TODO: compute from AST
    },
    drawChart (container, attentions, fromContainer, toContainer) {
      const maxStroke = 16

      container.innerHTML = ''

      const topPos = Array.from(fromContainer.children).map(v => v.offsetLeft + v.clientWidth / 2 - maxStroke / 2)
      const bottomPos = Array.from(toContainer.children).map(v => v.offsetLeft + v.clientWidth / 2 - maxStroke / 2)

      const width = Math.max(fromContainer.clientWidth, toContainer.clientWidth)
      const height = this.$parent.$el.clientHeight - 128;

      const linkGen = d3.linkVertical()

      const svg = d3.create('svg')
          .attr('width', width)
          .attr('height', height)

      const r = attentions.length
      const c = (attentions[0] || []).length

      const maxMagnitude = Math.max(...attentions.map(arr => Math.max(...arr.map(value => Math.abs(value)))))
      const lineWidthScale = d3.scaleLinear()
          .domain([0, maxMagnitude]).range([0, maxStroke])

      const links = new Array(c * r)
          .fill(0)
          .map((_, i) => {
            const row = ~~(i / c)
            const col = i % c

            return {
              source: [topPos[row], 0],
              target: [bottomPos[col], height],
              width: lineWidthScale(attentions[row][col]),
              from: row,
              to: col
            }
          })

      svg.append('g')
          .selectAll('path')
          .data(links)
          .join('path')
          .attr('d', linkGen)
          .attr('fill', 'none')
          .attr('stroke', d => d.width < 0 ? 'tomato' : 'steelblue')
          .style("opacity", 0.2)
          .attr('stroke-width', d => Math.abs(d.width))
          .attr('class', d => `from-${d.from} to-${d.to}`)

      this.svg = svg

      container.appendChild(svg.node())
    },
    setActiveLinks({from, to}) {
      this.svg.selectAll('path')
          .style("opacity", 0)

      if (from !== undefined) {
        this.svg.selectAll(`path.from-${from}`)
            .style("opacity", 0.2)
      }

      if (to !== undefined) {
        this.svg.selectAll(`path.to-${to}`)
            .style("opacity", 0.2)
      }
    },
    resetActiveLinks() {
      this.svg.selectAll('path')
          .style("opacity", 0.2)
    }
  },
  watch: {
    type () {
      setImmediate(() => {
        // HACK: wait for HTML layout
        this.drawChart(this.$refs.container, this.attentions[this.type], this.$refs.summary, this.$refs.sources)
      })
    }
  },
  mounted () {
    let width = -1

    // HACK: resize event not working for some reason
    setInterval(() => {
      if (this.$refs.container && (this.$refs.container.clientWidth !== width || width === -1)) {
        this.drawChart(this.$refs.container, this.attentions[this.type], this.$refs.summary, this.$refs.sources)
        width = this.$refs.container.clientWidth
      }
    }, 500)
  },
  created () {
    this.$parent.$emit('loading')

    this.$api.getAttentions(this.id).then(attentions => {
      this.attentions = attentions

      this.$api.getSummaryTokens(this.id).then(summary => {
        this.summaryTokens = summary

        // TODO: obtain from AST
        fetch('/mock/input.json')
            .then(response => response.json())
            .then(json => {
              this.sources.sequences = json['code sequence'].split(' ')
              this.sources.nodes = json['graph node'].split(' ')

              this.$parent.$emit('loaded')
            })
      })
    })
  }
}
</script>