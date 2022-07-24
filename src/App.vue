<template>
  <v-app>
    <v-app-bar
        density="compact">
      <v-app-bar-title>Code GNN</v-app-bar-title>
    </v-app-bar>
    <v-main>
      <!--      <v-container>-->
      <div style="padding: 16px">
        <v-row>
          <component-view
              cols="12"
              sm="4"
              name="Evaluation Matrix"
              icon="mdi-matrix"
              :loading="evaluationMatrices === null"
          >
            <evaluation-matrix :matrices="evaluationMatrices || {}"></evaluation-matrix>
          </component-view>

          <component-view
              cols="12"
              sm="4"
              name="Function Table"
              icon="mdi-table"
              :loading="functionInstances === null"
          >
            <function-table :functions="functionInstances" @set-active-instance="setActiveInstance"></function-table>
          </component-view>

          <component-view
              cols="12"
              sm="4"
              name="Embedding"
              icon="mdi-scatter-plot"
              :loading="embeddings === null && activeInstanceId !== -1"
          >
            <embedding :embeddings="embeddings" :ast="ast"></embedding>
          </component-view>
        </v-row>
        <v-row>
          <component-view
              cols="12"
              sm="4"
              name="Function Detail"
              icon="mdi-file-code-outline"
          >
            <function-details></function-details>
          </component-view>

          <component-view
              cols="12"
              sm="4"
              name="Attention"
              icon="mdi-file-code-outline"
          >
            <attention></attention>
          </component-view>

          <component-view
              cols="12"
              sm="4"
              name="Candidate Tokens"
              icon="mdi-file-code-outline"
          >
            <CandidateTokens></CandidateTokens>
          </component-view>
        </v-row>
      </div>
      <!--      </v-container>-->
    </v-main>
  </v-app>
</template>

<script>
import ComponentView from './components/ComponentView.vue'
import FunctionDetails from './components/FunctionDetail/FunctionDetail.vue'
import FunctionTable from './components/FunctionTable/FunctionTable.vue'
import EvaluationMatrix from './components/EvaluationMatrix/EvaluationMatrix.vue'
import Embedding from './components/Embedding/Embedding.vue'
import Attention from './components/Attention/Attention.vue'
import CandidateTokens from './components/CandidateTokens/CandidateTokens.vue'

export default {
  name: 'App',

  components: {
    CandidateTokens,
    Attention,
    EvaluationMatrix,
    FunctionDetails,
    ComponentView,
    FunctionTable,
    Embedding
  },

  data: () => ({
    evaluationMatrices: null,

    functionInstances: null,
    activeInstanceId: -1,

    embeddings: null,
    ast: null,

  }),

  methods: {
    setActiveInstance (id) {
      this.activeInstanceId = id

      Promise.all([
        this.$api.getEmbedding(id),
        this.$api.getAst(id)
      ]).then(([embedding, ast]) => {
        this.embeddings = embedding
        this.ast = new DOMParser().parseFromString(ast, 'text/xml')
      })
    }
  },

  mounted () {
    this.$api.getEvaluationScores().then(matrices => {
      this.evaluationMatrices = matrices
    })

    this.$api.getInstances().then(instances => {
      this.functionInstances = instances
    })
  }
}
</script>
