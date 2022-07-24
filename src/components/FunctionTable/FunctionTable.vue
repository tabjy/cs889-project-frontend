<template>
  <div>
    <div style="margin-top: 10px; margin-bottom: -38px;">
      <v-text-field
          label="Search"
          placeholder="Keywords"
          variant="underlined"
          v-model="keywords"
          style="padding-left: 8px; padding-right: 8px;"
      ></v-text-field>
    </div>
    <div>
      <v-table>
        <thead>
        <tr>
          <th class="text-left" style="width: 84px">
            ID
            <v-btn
                :icon="sort.key === 'id' && sort.descending ? 'mdi-chevron-down' : 'mdi-chevron-up'"
                @click.stop="sort.descending = sort.key === 'id' ? !sort.descending : false; sort.key = 'id'"
                :style="sort.key !== 'id' ? {opacity: 0.2}: {}"
                variant="text" class="ml-2" size="x-small" style="display: inline"></v-btn>
          </th>
          <th class="text-left">
            Source
            <v-btn
                :icon="sort.key === 'source' && sort.descending ? 'mdi-chevron-down' : 'mdi-chevron-up'"
                @click.stop="sort.descending = sort.key === 'source' ? !sort.descending : false; sort.key = 'source'"
                :style="sort.key !== 'source' ? {opacity: 0.2}: {}"
                variant="text" class="ml-2" size="x-small" style="display: inline"></v-btn>
          </th>
          <th class="text-left">
            Summary
            <v-btn
                :icon="sort.key === 'summary' && sort.descending ? 'mdi-chevron-down' : 'mdi-chevron-up'"
                @click.stop="sort.descending = sort.key === 'summary' ? !sort.descending : false; sort.key = 'summary'"
                :style="sort.key !== 'summary' ? {opacity: 0.2}: {}"
                variant="text" class="ml-2" size="x-small" style="display: inline"></v-btn>
          </th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="item in sortedFunctions"
            :key="item.name"
            @click.stop="$emit('setActiveInstance', item.id)"
            style="cursor: pointer"
        >
          <td>{{ item.id }}</td>
          <td style="white-space: nowrap; text-overflow:ellipsis; overflow: hidden; max-width:1px;">
          <span>
            {{ item.source }}
            <v-tooltip
                activator="parent"
                location="start"
            ><pre>{{ item.source }}</pre></v-tooltip>
          </span>
          </td>
          <td style="white-space: nowrap; text-overflow:ellipsis; overflow: hidden; max-width:1px;">
          <span>
            {{ item.summary }}
            <v-tooltip
                activator="parent"
                location="start"
            >{{ item.summary }}</v-tooltip>
          </span>
          </td>
        </tr>
        </tbody>
      </v-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FunctionTable',
  props: {
    functions: Array
  },
  data: () => ({
    sort: {
      key: 'id',
      descending: false
    },

    keywords: '',
  }),
  computed: {
    sortedFunctions () {
      const comparator = this.sort.key === 'id'
          ? (lhs, rhs) => lhs.id - rhs.id
          : (lhs, rhs) => String(lhs[this.sort.key]).localeCompare(String(rhs[this.sort.key]))

      const keywords = this.keywords.split(/\s+/g).filter(str => str.length).map(str => str.toLowerCase())

      if (!this.functions || !this.functions.length) {
        return []
      }

      return this.functions.filter(item =>
          !keywords.length ||
          keywords.find(keyword => item.source.toLowerCase().indexOf(keyword) !== -1 || item.summary.toLowerCase().indexOf(keyword) !== -1)
      ).sort((lhs, rhs) => comparator(lhs, rhs) * (this.sort.descending ? -1 : 1))
    }
  },
  // created () {
  //   this.$parent.$emit('loading')
  //
  //   this.$api.getInstances().then(instances => {
  //     this.functions = instances
  //
  //     this.$parent.$emit('loaded')
  //   })
  // }
}
</script>