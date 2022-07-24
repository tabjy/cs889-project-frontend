<template>
  <div style="margin-bottom: -38px;">
    <v-select
        v-model="method"
        :items="methods"
        label="Method"
        required
    ></v-select>
  </div>
  <div>
    <v-table v-if="method">
      <thead>
      <tr>
        <th class="text-left" v-for="key in Object.keys(matrices[method])" :key="key">
          {{ key }}
        </th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td class="text-left" v-for="key in Object.keys(matrices[method])" :key="key">
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
  props: {
    matrices: Object
  },
  data: () => ({
    sort: {
      key: 'id',
      descending: false
    },

    keywords: '',

    method: null,
  }),
  watch: {
    matrices () {
      this.method = Object.keys(this.matrices).sort()[0]
    }
  },
  computed: {
    methods () {
      return this.matrices ? Object.keys(this.matrices).sort() : []
    },

    sortedFunctions () {
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
  // created () {
  //   this.$parent.$emit('loading')
  //
  //   this.$api.getEvaluationScores().then(matrices => {
  //     this.matrices = matrices
  //     this.method = Object.keys(matrices).sort()[0]
  //
  //     this.$parent.$emit('loaded')
  //   })
  // }
}
</script>