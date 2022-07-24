<template>
  <div style="padding: 8px">
    <div style="display: inline-flex">
      <v-btn v-for="(token, i) in (summary || []).slice(1).filter(token => token.toLowerCase() !== '<null>')"
             @click.stop="setActivated(i)" style="text-transform: lowercase"
             :variant="variant(i)"
             @mouseover="setHighlights(i)"
             @mouseout="resetHighlights()"
      >
        {{ token }}
      </v-btn>
    </div>

    <v-table>
      <tbody>
      <tr
          v-for="(word, i) in ((candidates || [])[activated] || {words: []}).words"
      >
        <td style="width: 24px;">{{ i }}</td>
        <td style="white-space: nowrap; text-overflow:ellipsis; overflow: hidden; max-width:1px;">
          {{ word }}
        </td>
        <td style="white-space: nowrap; text-overflow:ellipsis; overflow: hidden; max-width:1px;">
          <v-progress-linear :model-value="candidates[activated].scores[i] * 100"></v-progress-linear>
        </td>
      </tr>
      </tbody>
    </v-table>
  </div>
</template>

<script>
import { reverselyMapIds } from '../../utils/ast'

export default {
  name: 'CandidateTokens',

  props: {
    summary: Array,
    candidates: Array,
    attentions: Object,
    editables: Set,
    highlights: Set,
    ast: XMLDocument
  },

  data: () => ({
    activated: 0,
  }),

  methods: {
    collectNodes(from, k = 5) {
      const idMaps = reverselyMapIds(this.ast)
      const attentions = this.attentions['nodes'][from]
      const tops = attentions.filter(value => value > 0).sort().reverse().slice(0, k)
      const ids = tops.map(value => attentions.indexOf(value))
      return ids.map(id => idMaps['nodes'].get(id.toString()))
    },

    variant (i) {
      if (this.activated === i && this.editables.size) {
        return 'outlined'
      }

      if (this.activated === i) {
        return 'tonal'
      }

      return 'text'
    },

    setHighlights(i) {
      const from = i + 1
      this.collectNodes(from).forEach(node => this.highlights.add(node))
    },

    resetHighlights() {
      this.highlights.clear()
    },

    setActivated (i) {
      const size = this.editables.size
      this.editables.clear()

      if (this.activated !== i) {
        this.activated = i
        return
      }

      if (size) {
        return
      }

      const from = i + 1
      this.collectNodes(from).forEach(node => this.editables.add(node))
    }
  }
}
</script>