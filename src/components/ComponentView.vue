<template>
  <v-col>
    <div
        :style="fullscreen ? {
    position: 'fixed',
    width: 'calc(100% - 16px)',
    height: 'calc(100% - 16px)',
    top: '8px',
    left: '8px',
    zIndex: '9999',
} : {}">
      <v-sheet elevation="4" rounded :height="fullscreen ? '100%' : '400px'">
        <v-layout style="height: 100%">
          <v-system-bar>
            <v-icon :icon="icon || 'mdi-scatter-plot'" class="mr-2"></v-icon>

            <span>{{ name || '[View Name]' }}</span>

            <v-spacer></v-spacer>

            <v-btn
                :icon="fullscreen ? 'mdi-fullscreen-exit' : 'mdi-fullscreen'"
                @click.stop="fullscreen = !fullscreen"
                variant="text" class="ml-2" size="x-small"></v-btn>
          </v-system-bar>

          <div v-if="loading" class="text-center" style="margin-top: auto; margin-bottom: auto; width: 100%">
            <v-progress-circular
                indeterminate
                color="primary"
            ></v-progress-circular>
          </div>
          <div style="overflow: auto; height: calc(100% - 24px); width: 100%; margin-top: 24px" :style="{display: loading ? 'none' : undefined}">
            <slot></slot>
          </div>
        </v-layout>
      </v-sheet>
    </div>
  </v-col>
</template>

<script>
export default {
  name: 'ComponentView',
  props: {
    'name': String,
    'icon': String,
    'loading': Boolean
  },
  data: () => ({
    fullscreen: false,
  }),
}
</script>