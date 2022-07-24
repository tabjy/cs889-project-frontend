const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

class ApiClient {
  async getEvaluationScores () {
    // TODO
    throw new Error('not implemented!')
  }

  async getInstances () {
    // TODO
    throw new Error('not implemented!')
  }

  async addInstance(source) {
    // TODO
    throw new Error('not implemented!')
  }

  async getEmbedding (id) {
    // TODO
    throw new Error('not implemented!')
  }

  async getAst (id) {
    // TODO
    throw new Error('not implemented!')
  }

  async getAttentions (id) {
    // TODO
    throw new Error('not implemented!')
  }

  async getSummaryTokens (id) {
    // TODO
    throw new Error('not implemented!')
  }

  async getCandidateTokens (id) {
    // TODO
    throw new Error('not implemented!')
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
      .map(([k, v]) => v.split(' '))
  }
}

export default {
  install: (app, { mock = false, gateway = 'http://localhost:8080' } = {}) => {
    // Plugin code goes here
    app.config.globalProperties.$api = mock ? new MockApiClient() : new ApiClient()
  }
}