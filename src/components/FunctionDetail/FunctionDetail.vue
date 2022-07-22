<template>
  <div>
    <pre style="font-size: 12px; padding: 8px"><code><code-node
        v-if="ast"
        :node="ast"
        :highlights="highlights"
        :editables="editables">

    </code-node></code></pre>
  </div>
</template>

<script>
import CodeNode from "./CodeNode.vue";

export default {
  name: 'FunctionDetails',
  components: {
    CodeNode
  },
  data () {
    return {
      // TODO: interactively update the id
      id: 0,
      ast: null,
      highlights: new Set(),
      editables: new Set()
    }
  },
  created () {
    this.$parent.$emit('loading')

    this.$api.getAst(this.id).then(xml => {
      this.ast = new DOMParser().parseFromString(xml, 'text/xml')
      this.$parent.$emit('loaded')
    })
  }
}
</script>

<style>
/*
theme adapter from https://github.com/highlightjs/highlight.js/blob/main/src/styles/vs.css
 */

/*
Visual Studio-like style based on original C# coloring by Jason Diamond <jason@diamond.name>
*/
.hljs {
  background: white;
  color: black;
}

.hljs-comment,
.hljs-quote,
.hljs-variable {
  color: #008000;
}

.hljs-keyword,
.hljs-selector-tag,
.hljs-built_in,
.hljs-name,
.hljs-tag {
  color: #00f;
}

.hljs-string,
.hljs-title,
.hljs-section,
.hljs-attribute,
.hljs-literal,
.hljs-template-tag,
.hljs-template-variable,
.hljs-type,
.hljs-addition {
  color: #a31515;
}

.hljs-deletion,
.hljs-selector-attr,
.hljs-selector-pseudo,
.hljs-meta {
  color: #2b91af;
}

.hljs-doctag {
  color: #808080;
}

.hljs-attr {
  color: #f00;
}

.hljs-symbol,
.hljs-bullet,
.hljs-link {
  color: #00b0e8;
}


.hljs-emphasis {
  font-style: italic;
}

.hljs-strong {
  font-weight: bold;
}
</style>