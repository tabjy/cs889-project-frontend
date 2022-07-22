<template>
  <div style="padding: 8px">
    <div style="display: inline-flex">
      <v-btn v-for="(token, i) in tokens.slice(1)" @click.stop="activated = i" variant="text" style="text-transform: lowercase">{{ token }}</v-btn>
    </div>

    <v-table>
      <tbody>
      <tr
          v-for="(item, i) in (candidates[activated] || [])"
      >
        <td>{{ i }}</td>
        <td style="white-space: nowrap; text-overflow:ellipsis; overflow: hidden; max-width:1px;">
          {{ item }}
        </td>
        <td style="white-space: nowrap; text-overflow:ellipsis; overflow: hidden; max-width:1px;">
          <v-progress-linear :model-value="80 - i * 5"></v-progress-linear>
        </td>
      </tr>
      </tbody>
    </v-table>
  </div>
</template>

<script>
export default {
  name: 'CandidateTokens',
  data: () => ({
    // TODO: interactively set token
    id: 0,
    tokens: [],
    activated: 0,
    candidates: [/* [] */]
  }),
  created () {
    this.$parent.$emit('loading')

    this.$api.getCandidateTokens(this.id).then(candidates => {
      this.candidates = candidates

      this.$api.getSummaryTokens(this.id).then(tokens => {
        this.tokens = tokens

        this.$parent.$emit('loaded')
      })
    })
  }
}
</script>