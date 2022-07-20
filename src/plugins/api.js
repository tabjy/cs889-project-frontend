const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

class ApiClient {
  async getEvaluationScores () {
    // TODO
    throw new Error('not implemented!')
  }
}

class MockApiClient extends ApiClient {
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
}

export default {
  install: (app, { mock = false, gateway = 'http://localhost:8080' } = {}) => {
    // Plugin code goes here
    app.config.globalProperties.$api = mock ? new MockApiClient() : new ApiClient()
  }
}