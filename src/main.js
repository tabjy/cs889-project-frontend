import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'

import api from './plugins/api'

loadFonts()

createApp(App)
  .use(vuetify)
  .use(api, { mock: true })
  .mount('#app')
