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
          >
            <evaluation-matrix></evaluation-matrix>
          </component-view>

          <component-view
              cols="12"
              sm="4"
              name="Function Table"
              icon="mdi-table"
          >
            <function-table></function-table>
          </component-view>

          <component-view
              cols="12"
              sm="4"
              name="Embedding"
              icon="mdi-scatter-plot"
          >
            <embedding></embedding>
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
        </v-row>
      </div>
      <!--      </v-container>-->
    </v-main>
  </v-app>
</template>

<script>
import ComponentView from "./components/ComponentView.vue";
import FunctionDetails from "./components/FunctionDetail/FunctionDetail.vue";
import FunctionTable from "./components/FunctionTable/FunctionTable.vue";
import EvaluationMatrix from "./components/EvaluationMatrix/EvaluationMatrix.vue";
import Embedding from "./components/Embedding/Embedding.vue";
import Attention from './components/Attention/Attention.vue'

export default {
  name: 'App',

  components: {
    Attention,
    EvaluationMatrix,
    FunctionDetails,
    ComponentView,
    FunctionTable,
    Embedding
  },

  data: () => ({
  }),
}
</script>
