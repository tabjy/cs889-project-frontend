<template>
  <div>
    <v-row>
      <v-col style="{
        margin-bottom: -23px;
        font-size: 24px;
        padding: 16px 16px 0 16px;
      }">
        <v-select
            v-model="method"
            :items="methods"
            label="Method"
            required
        ></v-select>
      </v-col>
    </v-row>
    <v-table>
      <thead>
      <tr>
        <th class="text-left" v-for="key in Object.keys(matrices[method]).sort()" :key="key">
          {{ key }}
        </th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td class="text-left" v-for="key in Object.keys(matrices[method]).sort()" :key="key">
          {{ matrices[method][key] }}
        </td>
      </tr>
      </tbody>
    </v-table>
  </div>
</template>

<script>
export default {
  name: 'EvaluationMatrix',
  props: {},
  data: () => ({
    sort: {
      key: 'id',
      descending: false
    },

    keywords: '',

    method: 'BLEU',
    methods: [
      'BLEU',
      'ROUGE-LCS',
    ],

    matrices: {
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
  }),
  computed: {
    sortedFunctions() {
      const comparator = this.sort.key === 'id'
          ? (lhs, rhs) => lhs.id - rhs.id
          : (lhs, rhs) => String(lhs[this.sort.key]).localeCompare(String(rhs[this.sort.key]))

      const keywords = this.keywords.split(/\s+/g).filter(str => str.length).map(str => str.toLowerCase())


      return this.functions.filter(item =>
          !keywords.length ||
          keywords.find(keyword => item.source.toLowerCase().indexOf(keyword) !== -1 || item.summary.toLowerCase().indexOf(keyword) !== -1)
      ).sort((lhs, rhs) => comparator(lhs, rhs) * (this.sort.descending ? -1 : 1))
    }
  },
}
</script>