const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

class ApiClient {
  constructor () {
    this.instances = null

    // FIXME: mem leaks?
    this.monitors = []
  }

  static _preprocess(json) {
    return {
      ast: json['input_dict']['newxml'],
      // source: ...,
      embeddings: {
        sequences: json['intermediate_output'][1]['Embedding for code sequence'][0],
        nodes: json['intermediate_output'][1]['Embedding for code graph node'][0]
      },
      attentions: {
        sequence: json['intermediate_output'][Object.keys(json['intermediate_output']).length]['Attention weight between code sequence and predicted document'][0],
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

  async getEvaluationScores () {
    // TODO: replace with actual evaluation score

    // simulate network delay
    await sleep(500 + 1000 * Math.random())
    return {
      'BLEU': {
        'BLEU-1': 18.69,
        'BLEU-2': 22.11,
        'BLEU-3': 14.25,
        'BLEU-4': 10.91
      },
      'ROUGE-LCS': {
        'OUGE-LCS F1': 49.75
      }
    }
  }

  async getInstances () {
    if (!this.instances) {
      this.instances = (await (await fetch('/dataset.json')).json())
    }

    await Promise.all(this.monitors)

    return this.instances.map(instance => ({
      id: instance.id,
      source: new DOMParser().parseFromString(instance.ast, 'text/xml').firstElementChild.textContent,
      summary: instance.candidates.map(({words}) => words[0]).filter(word => !word.startsWith('<')).join(' '),
    }))
  }

  async addInstance(source) {
    const promise = fetch('/submit_payload', {
      method: 'POST',
      body: JSON.stringify({input_code: source})
    }).then(resp => resp.json()).then(json => {
      json = ApiClient._preprocess(json)
      this.instances.push({
        id: this.instances.length,
        ...json
      })
    })

    // return immediately. wait in getInstances()
    this.monitors.push(promise)
  }

  async getEmbedding (id) {
    await sleep(200 + 200 * Math.random())
    return this.instances[id].embeddings
  }

  async getAst (id) {
    await sleep(200 + 200 * Math.random())
    return this.instances[id].ast
  }

  async getAttentions (id) {
    await sleep(200 + 200 * Math.random())
    return this.instances[id].attentions
  }

  async getSummaryTokens (id) {
    await sleep(200 + 200 * Math.random())
    return ['<s>', ...this.instances[id].candidates.map(({words}) => words[0])]
  }

  async getCandidateTokens (id) {
    await sleep(200 + 200 * Math.random())
    return this.instances[id].candidates
  }
}

class MockApiClient extends ApiClient {
  constructor () {
    super()

    this.instances = [
      {
        id: 0,
        source: 'public static void main(String[] args) {\n  System.out.println("hello world!");\n}',
        summary: 'print the string "hello world" to console',
      },
        {
          id: 1,
          source: 'private int add(int a, int b) {\n  return a + b;\n}',
          summary: 'add the two input integer'
        },
        {
          id: 2,
          source: 'private int subtract(int a, int b) {\n  return a - b;\n}',
          summary: 'subtract the second input from the first'
        },
        {
          id: 3,
          source: 'private int mul(int a, int b) {\n  return a * b;\n}',
          summary: 'multiply the two input integers'
        }
      ]
  }

  async getEvaluationScores () {
    // simulate network delay
    await sleep(500 + 1000 * Math.random())
    return {
      'BLEU': {
        'BLEU-1': 18.69,
        'BLEU-2': 22.11,
        'BLEU-3': 14.25,
        'BLEU-4': 10.91
      },
      'ROUGE-LCS': {
        'OUGE-LCS F1': 49.75
      }
    }
  }

  async getInstances () {
    await sleep(500 + 1000 * Math.random())
    return this.instances
  }

  async addInstance(source) {
    await sleep(500 + 1000 * Math.random())
    this.instances.push({
      id: this.instances.length,
      source,
      summary: 'some random dummy summary'
    })
  }

  async getEmbedding (id) {
    const response = await fetch('/mock/layer_output.json')
    const json = await response.json()
    return {
      sequences: json[1]['Embedding for code sequence'][0],
      nodes: json[1]['Embedding for code graph node'][0],
    }
  }

  async getAst (id) {
    const response = await fetch('/mock/code.json')
    const json = await response.json()
    return json.ast
  }

  async getAttentions (id) {
    const response = await fetch('/mock/layer_output.json')
    const json = await response.json()
    const attentions = json[Object.keys(json).length]
    return {
      sequences: attentions['Attention weight between code sequence and predicted document'][0],
      nodes: attentions['Attention weight between graph node sequence and predicted document'][0]
    }
  }

  async getSummaryTokens (id) {
    const response = await fetch('/mock/input.json')
    const json = await response.json()
    return json.summary.split(' ')
  }

  async getCandidateTokens (id) {
    const response = await fetch('/mock/input.json')
    const json = await response.json()
    return Object.entries(json['topK_word'])
      .sort(([k1], [k2]) => parseInt(k1) - parseInt[k2])
      .map(([k, v]) => ({
        words: v.split(' '),
        scores: new Array(10).fill(0).map((_, i) => (1 - i * 0.5))
      }))
  }
}

export default {
  install: (app, { mock = false, gateway = 'http://localhost:8080' } = {}) => {
    // Plugin code goes here
    app.config.globalProperties.$api = mock ? new MockApiClient() : new ApiClient()
  }
}