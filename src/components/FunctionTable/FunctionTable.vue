<template>
  <div>
    <div style="margin-top: 10px; margin-bottom: -38px;">
      <div style="display: inline-flex; width: 100%">
        <v-text-field
            label="Search"
            placeholder="Keywords"
            variant="underlined"
            v-model="keywords"
            style="padding-left: 8px; padding-right: 8px;"
        ></v-text-field>
        <div style="padding-left: 4px; padding-right: 4px">
          <v-dialog
              v-model="dialog"
              persistent
          >
            <template v-slot:activator="{ props }">
              <v-btn
                  icon="mdi-plus"
                  variant="outline"
                  v-bind="props"
              ></v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">Add new instance</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <iframe
                      ref="iframe"
                      src="/editor-iframe.html"
                      style="height: 600px; width: 800px; border: none;"
                  />
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="blue-darken-1"
                    text
                    @click="dialog = false"
                >
                  Close
                </v-btn>
                <v-btn
                    color="blue-darken-1"
                    text
                    @click="addInstance()"
                >
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </div>
    </div>
    <div>
      <v-table id="function-table">
        <thead>
        <tr>
          <th class="text-left" style="padding-left: 0; max-width: 1px;">
          </th>
          <th class="text-left" style="width: 80px">
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
            :key="item.id"
            @click.stop="$emit('setActiveInstance', item.id)"
            style="cursor: pointer"
        >
          <td>
            <v-checkbox
                v-model="selectedInstances[item.id]"
                @click.stop=""
                style="height: 24px;margin-top: -28px; margin-left: -20px; max-width:1px;"></v-checkbox>
          </td>
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

    _selectedInstances: [],

    dialog: true
  }),
  computed: {
    selectedInstances () {
      return new Proxy({}, {
        get: (target, p, receiver) => {
          return this._selectedInstances.indexOf(p) !== -1
        },
        set: (target, p, value, receiver) => {
          if (value && this._selectedInstances.indexOf(p) === -1) {
            this._selectedInstances.push(p)
            this.$emit('addSelectedInstance', parseInt(p.toString()))
            return true
          }

          if (!value && this._selectedInstances.indexOf(p) !== -1) {
            this._selectedInstances.splice(this._selectedInstances.indexOf(p), 1)
            this.$emit('removeSelectedInstance', parseInt(p.toString()))
            return true
          }

          return false
        }
      })
    },
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
  methods: {
    resetEditor () {
      const params = {
        method: 'createEditor',
        value: 'public void myFunction() {\n    // TODO: input your function here\n}\n',
        language: 'java'
      }
      this.$refs.iframe.contentWindow.postMessage(JSON.stringify(params), '*')
    },
    async getEditorContent () {
      return new Promise((resolve, reject) => {
        const handler = setTimeout(() => reject(new Error('timed out')), 1000)

        const oldListener = window.onmessage

        window.onmessage = (e) => {
          window.onmessage = oldListener

          let data
          try {
            data = JSON.parse(e.data)
          } catch (err) {
            reject(err)
            return
          }
          switch (data.method) {
            case 'gotValue':
              clearTimeout(handler)
              resolve(data.value)
              return
          }
        }

        this.$refs.iframe.contentWindow.postMessage(JSON.stringify({ method: 'getValue' }), '*')
      })
    },
    addInstance () {
      this.getEditorContent().then(source => {
        this.$api.addInstance(source).then(() => {
          this.dialog = false
          this.$emit('reloadInstances')
        })
      })
    }
  },
  mounted () {
    window.onmessage = (e) => {
      console.log(e)
      let data
      try {
        data = JSON.parse(e.data)
      } catch (err) {
        return
      }
      switch (data.method) {
        case 'ready':
          this.resetEditor()
      }
    }
  }
}
</script>

<style>
#function-table th, #function-table td {
  padding-left: 16px;
  padding-right: 0;
}
</style>