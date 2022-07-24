<template>
  <v-row style="margin-left: 8px; margin-top: 16px">
    <div>
      <h3>Function {{ id }}:</h3>
      <p class="text-caption">
        {{ summary ? `"${summary.filter(token => !token.startsWith('<')).join(' ')}"` : 'Loading...' }}</p>
    </div>
  </v-row>
  <v-row style="margin-top: 4px">
    <component-view
        cols="12"
        sm="4"
        name="Function Detail"
        icon="mdi-file-code-outline"
        :loading="ast === null"
    >
      <function-details :ast="ast" :editables="editables" :highlights="highlights" @reload-instances="$emit('reloadInstances')"></function-details>
    </component-view>

    <component-view
        cols="12"
        sm="4"
        name="Attention"
        icon="mdi-file-code-outline"
        :loading="attentions === null || ast === null || summary === null"
    >
      <attention :attentions="attentions" :ast="ast" :summary="summary" :highlights="highlights"></attention>
    </component-view>

    <component-view
        cols="12"
        sm="4"
        name="Candidate Tokens"
        icon="mdi-file-code-outline"
        :loading="candidates === null || summary === null"
    >
      <CandidateTokens :candidates="candidates" :ast="ast" :summary="summary" :attentions="attentions"
                       :editables="editables" :highlights="highlights"></CandidateTokens>
    </component-view>
  </v-row>
</template>

<script>
import ComponentView from './ComponentView.vue'
import FunctionDetails from './FunctionDetail/FunctionDetail.vue'
import Attention from './Attention/Attention.vue'
import CandidateTokens from './CandidateTokens/CandidateTokens.vue'

export default {
  name: 'InstanceView',

  components: {
    ComponentView,
    FunctionDetails,
    Attention,
    CandidateTokens
  },

  props: {
    id: Number
  },

  data () {
    return {
      summary: null,
      ast: null,
      highlights: new Set(),
      editables: new Set(),
      attentions: null,
      candidates: null
    }
  },

  mounted () {
    this.summary = null

    this.$api.getSummaryTokens(this.id).then(tokens => {
      this.summary = tokens
    })

    this.$api.getAst(this.id).then(xml => {
      this.ast = new DOMParser().parseFromString(xml, 'text/xml')
    })

    this.$api.getAttentions(this.id).then(attentions => {
      this.attentions = attentions
    })

    this.$api.getCandidateTokens(this.id).then(tokens => {
      this.candidates = tokens
    })
  }
}
</script>