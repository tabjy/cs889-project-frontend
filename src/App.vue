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
            <function-table :functions="functionInstances"
                            @set-active-instance="setActiveInstance"
                            @add-selected-instance="addSelectedInstance"
                            @remove-selected-instance="removeSelectedInstance"
                            @reload-instances="reloadInstances()"
            ></function-table>
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

        <instance-view v-for="(id, i) in selectedInstances" :id="id" @reload-instances="reloadInstances()"></instance-view>
      </div>
    </v-main>
  </v-app>
</template>

<script>
import ComponentView from './components/ComponentView.vue'
import FunctionTable from './components/FunctionTable/FunctionTable.vue'
import EvaluationMatrix from './components/EvaluationMatrix/EvaluationMatrix.vue'
import Embedding from './components/Embedding/Embedding.vue'
import InstanceView from './components/InstanceView.vue'

export default {
  name: 'App',

  components: {
    InstanceView,
    EvaluationMatrix,
    ComponentView,
    FunctionTable,
    Embedding
  },

  data: () => ({
    evaluationMatrices: null,

    functionInstances: null,
    activeInstanceId: -1,
    selectedInstances: [],

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
    },
    addSelectedInstance (id) {
      if (this.selectedInstances.indexOf(id) === -1) {
        this.selectedInstances.push(id)
      }
    },
    removeSelectedInstance (id) {
      if (this.selectedInstances.indexOf(id) !== -1) {
        this.selectedInstances.splice(this.selectedInstances.indexOf(id), 1)
      }
    },

    reloadInstances () {
      console.log('test')

      this.functionInstances = null
      this.$api.getInstances().then(instances => {
        this.functionInstances = instances
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
