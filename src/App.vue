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
              name="Embedding"
              icon="mdi-scatter-plot"
          >
            <embedding></embedding>
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
              name="Evaluation Matrix"
              icon="mdi-matrix"
          >
            <evaluation-matrix></evaluation-matrix>
          </component-view>
        </v-row>
        <v-row>
          <component-view
              cols="12"
              sm="4"
              name="Function Detail"
              icon="mdi-file-code-outline"
          >
            <function-details :ast="ast" :highlights="new Set()" :editables="new Set()"></function-details>
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

export default {
  name: 'App',

  components: {
    EvaluationMatrix,
    FunctionDetails,
    ComponentView,
    FunctionTable,
    Embedding
  },

  data: () => ({
    ast: new DOMParser().parseFromString(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<unit xmlns="http://www.srcML.org/srcML/src" revision="1.0.0" language="Java" filename="Ast.java"><package>package <name><name>com</name><operator>.</operator><name>tabjy</name><operator>.</operator><name>snippets</name><operator>.</operator><name>expression_compiler</name></name>;</package>

<class><specifier>public</specifier> class <name>Ast</name> <block>{
    <interface>interface <name>IExpression</name> <block>{

    }</block></interface>

    <class><specifier>public</specifier> <specifier>static</specifier> class <name>ThisExpression</name> <super_list><implements>implements <super><name>IExpression</name></super></implements></super_list> <block>{

    }</block></class>

    <class><specifier>public</specifier> <specifier>static</specifier> class <name>OutwardsCastingExpressing</name> <super_list><implements>implements <super><name>IExpression</name></super></implements></super_list> <block>{
        <decl_stmt><decl><type><specifier>private</specifier> <specifier>final</specifier> <name>TypeName</name></type> <name>typeName</name></decl>;</decl_stmt>

        <constructor><name>OutwardsCastingExpressing</name><parameter_list>(<parameter><decl><type><name>TypeName</name></type> <name>typeName</name></decl></parameter>)</parameter_list> <block>{<block_content>
            <expr_stmt><expr><name><name>this</name><operator>.</operator><name>typeName</name></name> <operator>=</operator> <name>typeName</name></expr>;</expr_stmt>
        </block_content>}</block></constructor>
    }</block></class>

    <class><specifier>public</specifier> <specifier>static</specifier> class <name>FieldAccessExpression</name> <super_list><implements>implements <super><name>IExpression</name></super></implements></super_list> <block>{
        <constructor><specifier>public</specifier> <name>FieldAccessExpression</name><parameter_list>(<parameter><decl><type><name>TypeName</name></type> <name>typeName</name></decl></parameter>, <parameter><decl><type><name><name>Tokenizer</name><operator>.</operator><name>Token</name></name></type> <name>identifier</name></decl></parameter>)</parameter_list> <block>{<block_content>
            <assert>assert <expr><name><name>identifier</name><operator>.</operator><name>type</name></name> <operator>==</operator> <name><name>Tokenizer</name><operator>.</operator><name>Type</name><operator>.</operator><name>IDENTIFIER</name></name></expr>;</assert> <comment type="line">// Production runtime check</comment>
        </block_content>}</block></constructor>
    }</block></class>

    <class><specifier>public</specifier> <specifier>static</specifier> class <name>ArrayAccessExpression</name> <super_list><implements>implements <super><name>IExpression</name></super></implements></super_list> <block>{
        <constructor><specifier>public</specifier> <name>ArrayAccessExpression</name><parameter_list>(<parameter><decl><type><name>IExpression</name></type> <name>arrayExpression</name></decl></parameter>, <parameter><decl><type><name>IExpression</name></type> <name>indexExpression</name></decl></parameter>)</parameter_list> <block>{<block_content>

        </block_content>}</block></constructor>
    }</block></class>

    <class><specifier>public</specifier> <specifier>static</specifier> class <name>TypeName</name> <block>{
        <decl_stmt><decl><type><specifier>private</specifier> <specifier>final</specifier> <name>String</name></type> <name>packageName</name></decl>;</decl_stmt>
        <decl_stmt><decl><type><specifier>private</specifier> <specifier>final</specifier> <name>String</name></type> <name>className</name></decl>;</decl_stmt>

        <constructor><specifier>public</specifier> <name>TypeName</name><parameter_list>(<parameter><decl><type><name>String</name></type> <name>packageName</name></decl></parameter>, <parameter><decl><type><name>String</name></type> <name>className</name></decl></parameter>)</parameter_list> <block>{<block_content>
            <expr_stmt><expr><name><name>this</name><operator>.</operator><name>packageName</name></name> <operator>=</operator> <name>packageName</name></expr>;</expr_stmt>
            <expr_stmt><expr><name><name>this</name><operator>.</operator><name>className</name></name> <operator>=</operator> <name>className</name></expr>;</expr_stmt>
        </block_content>}</block></constructor>
    }</block></class>
}</block></class>
</unit>`, 'text/xml').childNodes[0]
  }),
}
</script>
