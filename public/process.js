function process (json) {
  return {
    ast: json['input_dict']['newxml'],
    // source: ...,
    embeddings: {
      sequences: json['intermediate_output'][1]['Embedding for code sequence'][0],
      nodes: json['intermediate_output'][1]['Embedding for code graph node'][0]
    },
    attentions: {
      sequences: json['intermediate_output'][Object.keys(json['intermediate_output']).length]['Attention weight between code sequence and predicted document'][0],
      nodes: json['intermediate_output'][Object.keys(json['intermediate_output']).length]['Attention weight between graph node sequence and predicted document'][0]
    },
    // summary: ...,
    candidates: Object.entries(json['input_dict']['topK_word'])
      .sort(([k1], [k2]) => parseInt(k1) - parseInt[k2])
      .map(([k, v]) => ({
        words: v.split(' '),
        scores: json['input_dict']['topK_confidence_score'][k]
      }))
  }
}

const result = Object.values(require('./final_dict.json')).map((value, i) => ({
  id: i,
  ...process(value)
}))

require('fs').writeFileSync('./dataset.json', JSON.stringify(result))

// console.log(result)

// setTimeout(() => {}, 10000000)