<template>
  <div style="height: 100%">
    <div style="width: 100%; overflow: auto"
         :style="{ height: edited ? 'calc(100% - 56px)' : '100%'}">
        <pre ref="container" style="font-size: 14px; padding: 4px"><code><code-node
            v-if="ast && updateTrigger"
            :node="ast"
            :highlights="highlights"
            :editables="editables">

    </code-node></code></pre>
    </div>
    <div v-if="edited" style="display: flex; padding: 8px">
      <v-btn @click.stop="addInstance()">Add Instance</v-btn>
      <v-btn @click.stop="reset()" style="margin-left: 4px">Reset</v-btn>
    </div>
  </div>
</template>

<script>
import CodeNode from './CodeNode.vue'

export default {
  name: 'FunctionDetails',
  components: {
    CodeNode
  },

  props: {
    ast: XMLDocument,
    highlights: Set,
    editables: Set
  },

  data () {
    return {
      edited: false,
      handler: null,
      updateTrigger: true
    }
  },

  methods: {
    reset () {
      this.updateTrigger = false
      setTimeout(() => {
        this.updateTrigger = true
      }, 0)
    },
    addInstance() {
      const source = this.$refs.container.textContent

      this.$api.addInstance(source).then(() => {
        this.reset()
        this.$emit('reloadInstances')
      })
    }
  },

  mounted () {
    this.handler = setInterval(() => {
      this.edited = this.ast.firstElementChild.textContent !== this.$refs.container.textContent
    }, 1000)
  },

  beforeUnmount () {
    clearInterval(this.handler)
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