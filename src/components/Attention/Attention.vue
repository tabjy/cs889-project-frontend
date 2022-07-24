<template>
  <div style="margin-bottom: -38px; height: 94px">
    <div style="display: inline-flex; width: 100%">
      <v-radio-group
          v-model="type"
          inline
      >
        <v-radio
            label="Nodes"
            value="nodes"
        ></v-radio>
        <v-radio
            label="Sequences"
            value="sequences"
        ></v-radio>
      </v-radio-group>
    </div>
  </div>

  <div style="height: calc(100% - 56px); overflow-x: auto; padding-left: 4px; padding-right: 4px">
    <div ref="summary" style="display: inline-flex">
      <v-chip v-for="(token, i) in (summary||[]).filter(token => token.toLowerCase() !== '<null>')"
              @mouseover="setHighlights({from: i}) || !locked && setActiveLinks({from: i})"
              @mouseout="resetHighlights() || !locked && resetActiveLinks()"
              @click.stop="locked = !locked ? `from-${i}` : null"
              :style="{border: locked === `from-${i}` ? 'thin solid currentColor' : undefined}"
              style="margin-right: 8px">
        {{ token }}
      </v-chip>
    </div>

    <div ref="container" style="height: calc(100% - 68px)"></div>

    <div ref="sources" style="display: inline-flex">
      <v-chip v-for="(source, i) in sources[type]"
              @mouseover="setHighlights({to: i}) || !locked && setActiveLinks({to: i})"
              @mouseout="resetHighlights() || !locked && resetActiveLinks()"
              @click.stop="locked = !locked ? `to-${i}` : null"
              :style="{border: locked === `to-${i}` ? 'thin solid currentColor' : undefined}"
              style="margin-right: 8px">
        {{ source }}
      </v-chip>
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3'
import { reverselyMapIds } from '../../utils/ast'

export default {
  name: 'Attention',

  props: {
    summary: Array,
    attentions: Object,
    ast: XMLDocument,
    highlights: Set,
  },

  data: () => ({
    locked: null,
    type: 'nodes',

    _idMaps: null,
    _sources: null,

    svg: null
  }),

  computed: {
    sources () {
      if (this._sources) {
        return this._sources
      }

      if (!this.ast) {
        return {
          sequences: [],
          nodes: []
        }
      }

      if (!this._idMaps) {
        this._idMaps = reverselyMapIds(this.ast)
      }

      this._sources = {
        sequences: Array.from(this._idMaps.tokens.entries()).sort(([k1], [k2]) => parseInt(k1) - parseInt(k2)).map(([_, v]) => v).slice(0, 50),
        nodes: Array.from(this._idMaps.names.entries()).sort(([k1], [k2]) => parseInt(k1) - parseInt(k2)).map(([_, v]) => v).slice(0, 100),
      }

      return this._sources
    }
  },

  methods: {
    drawChart () {
      this.$refs.container.innerHTML = ''

      if (!this.attentions) {
        return
      }

      const width = Math.max(this.$refs.summary.clientWidth, this.$refs.sources.clientWidth)
      const height = this.$refs.container.clientHeight

      const maxStroke = 16
      const topPos = Array.from(this.$refs.summary.children).map(v => v.offsetLeft + v.clientWidth / 2 - maxStroke / 4)
      const bottomPos = Array.from(this.$refs.sources.children).map(v => v.offsetLeft + v.clientWidth / 2 - maxStroke / 4)

      const linkGen = d3.linkVertical()

      const svg = d3.create('svg')
          .attr('width', width)
          .attr('height', height)

      const attention = this.attentions[this.type].slice(0, this.summary.filter(token => token.toLowerCase() !== '<null>').length)

      const r = attention.length
      const c = (attention[0] || []).length

      const maxMagnitude = Math.max(...attention.map(arr => Math.max(...arr.map(value => Math.abs(value)))))
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
              width: lineWidthScale(attention[row][col]),
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
          .style('opacity', 0.2)
          .attr('stroke-width', d => Math.abs(d.width))
          .attr('class', d => `from-${d.from} to-${d.to}`)

      this.svg = svg

      this.$refs.container.appendChild(svg.node())
    },
    setActiveLinks ({ from, to }) {
      this.svg.selectAll('path')
          .style('opacity', 0.02)

      if (from !== undefined) {
        this.svg.selectAll(`path.from-${from}`)
            .style('opacity', 0.5)
      }

      if (to !== undefined) {
        this.svg.selectAll(`path.to-${to}`)
            .style('opacity', 0.5)
      }
    },
    resetActiveLinks () {
      this.svg.selectAll('path')
          .style('opacity', 0.2)
    },
    setHighlights ({ from, to }) {
      if (to !== undefined) {
        this.highlights.clear()
        const node = this._idMaps[this.type].get(to.toString())
        this.highlights.add(node)
      }

      if (from !== undefined) {
        this.highlights.clear()
        const attentions = this.attentions[this.type][from]
        const tops = attentions.filter(value => value > 0).sort().reverse().slice(0, 10)
        const ids = tops.map(value => attentions.indexOf(value))
        ids.forEach(id => this.highlights.add(this._idMaps[this.type].get(id.toString())))
      }
    },
    resetHighlights () {
      this.highlights.clear()
    }
  },
  watch: {
    type () {
      if (this.attentions) {
        // this.drawChart()
        setTimeout(() => this.drawChart(), 0) // HACK: wait for DOM to layout
      }
    },
  },
  mounted () {
    const observer = new ResizeObserver(() => {
      this.drawChart()
    })

    observer.observe(this.$refs.container)
  },
}
</script>