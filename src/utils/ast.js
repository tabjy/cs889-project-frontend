export function reverselyMapIds (ast) {
  if (typeof ast === 'string') {
    ast = new DOMParser().parseFromString(ast, 'text/xml')
  }

  const result = {
    nodes: new Map(),
    sequences: new Map(),
    names: new Map(), // node name
    tokens: new Map() // sequence tokens
  }

  const helper = (node) => {
    if (node.nodeName === '#text') {
      return
    }

    const nodeIds = (node.getAttribute('node-id') || '').split(' ').filter(Boolean)
    const seqIds = (node.getAttribute('seq-id') || '').split(' ').filter(Boolean)
    const tokens = (node.getAttribute('tokens') || '').split(' ').filter(Boolean)

    for (let i = 0; i < nodeIds.length; i++) {
      result.nodes.set(nodeIds[i], node)
      result.names.set(nodeIds[i], i === 0 ? node.nodeName : tokens[i - 1])
    }

    for (let i = 0; i < seqIds.length; i++) {
      result.sequences.set(seqIds[i], node.firstChild) // the text node
      result.tokens.set(seqIds[i], tokens[i])
    }

    Array.from(node.childNodes).forEach(helper)
  }

  helper(ast.firstChild)

  return result
}

export function getTagType (name) {
  switch (name) {
    case 'comment':
      return 0
    case 'literal':
      return 1
    case 'name':
      return 2
    case 'assert': // statements
    case 'block':
    case 'break':
    case 'case':
    case 'continue':
    case 'default':
    case 'do':
    case 'empty_stmt':
    case 'expr_stmt':
    case 'for':
    case 'if_stmt':
    case 'label':
    case 'return':
    case 'switch':
    case 'while':
    case 'catch':
    case 'finally':
    case 'throw':
    case 'throws':
    case 'try':
      return 3
    case 'block_content': // sub statements
    case 'condition':
    case 'control':
    case 'else':
    case 'if':
    case 'expr':
    case 'incr':
    case 'then':
    case 'type':
      return 4
    case 'specifier':
      return 5
    case 'lambda': // declarations
    case 'function':
    case 'decl_stmt':
      return 6
    case 'annotation': // types
    case 'annotation_defn':
    case 'class':
    case 'constructor':
    case 'enum':
    case 'extends':
    case 'implements':
    case 'super_list':
    case 'interface':
    case 'interface_decl':
    case 'static':
      return 7
    case 'call': // expressions
    case 'ternary':
      return 8
    case 'import': // other
    case 'package':
    case 'synchronized':
    default:
      return 9
  }
}
