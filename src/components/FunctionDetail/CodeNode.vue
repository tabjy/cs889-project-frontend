<template>
  <span
      :class="'code-node hljs hljs-' + highlightType"
      :style="{
        backgroundColor: highlights.has(node) ? 'yellow' : 'inherit',
        textDecoration: editables.has(node) ? 'underline dashed' : 'none'
        // border: editables.has(node) ? '2px dashed orange' : 'none'
      }"

      :contenteditable="editables.has(node) ? 'true' : 'inherit'"
      spellcheck="false"
  >
    <template v-if="node.nodeName === '#text'">{{ node.textContent }}</template>
    <template v-else v-for="(child) in Array.from(node.childNodes)" v-bind:key="child">
      <code-node v-if="child.nodeName !== '#text' || (child.nodeName === '#text' && child.textContent.length)" :node="child" :highlights="highlights" :editables="editables"></code-node>
    </template>
  </span>
</template>

<script>

export default {
  name: 'CodeNode',
  props: {
    node: [Element, Text],
    highlights: Set,
    editables: Set
  },
  computed: {
    src() {
      return new XMLSerializer().serializeToString(this.node)
    },
    highlightType() {
      if (!this.node.parentNode) return ''


      switch (this.node.parentNode.nodeName) {
        case 'comment':
          return 'comment'
          // case '':
          //   return 'quote'
        case 'decl_stmt':
          return 'variable'
        case 'assert':
        case 'break':
        case 'case':
        case 'continue':
        case 'default':
        case 'do':
        case 'for':
        case 'if_stmt':
        case 'return':
        case 'switch':
        case 'while':
        case 'else':
        case 'if':
        case 'specifier':
        case 'class':
        case 'constructor':
        case 'enum':
        case 'extends':
        case 'implements':
        case 'interface':
        case 'static':
        case 'import':
        case 'package':
        case 'synchronized':
        case 'finally':
        case 'throw':
        case 'throws':
        case 'try':
        case 'catch':
          return 'keyword'
          // case '':
          //   return 'selector-tag'
          // case '':
          //   return 'built_in'
        case 'label':
        case 'interface_decl':
          return 'name'
          // case '':
          //   return 'tag'
          // case '':
          //   return 'string'
          // case '':
          //   return 'title'
          // case '':
          //   return 'section'
          // case '':
          //   return 'attribute'
        case 'literal':
          return 'literal'
          // case '':
          //   return 'template-tag'
          // case '':
          //   return 'template-variable'
        case 'type':
        case 'super_list':
          return 'type'
          // case '':
          //   return 'addition'
          // case '':
          //   return 'deletion'
          // case '':
          //   return 'selector-attr'
          // case '':
          //   return 'selector-pseudo'
          // case '':
          //   return 'meta'
          // case '':
          //   return 'doctag'
          // case '':
          //   return 'attr'
        case 'incr':
        case 'then':
        case 'ternary':
          return 'symbol'
          // case '':
          //   return 'bullet'
          // case '':
          //   return 'link'
        case 'annotation':
        case 'annotation_defn':
          return 'emphasis'
          // case '':
          //   return 'strong'
          // case 'escape':
          // case 'block':
          // case 'empty_stmt':
          // case 'expr_stmt':
          // case 'block_content':
          // case 'condition':
          // case 'control':
          // case 'expr':
          // case 'lambda':
          // case 'function':
          // case 'call':
          // case 'name':
          // default:
          //   return ''
      }

      if (this.node.parentNode.parentNode && this.node.parentNode.parentNode.nodeName && this.node.parentNode.parentNode.nodeName === 'type') {
        return 'type'
      }

      return ''
    }
  },
}
</script>

<style>
.code-node {
  /*background-color: inherit;*/
}
</style>