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

// print mock dataset for development purpose
;((async () => {
  console.log(await (await fetch('/mock/code.json')).json())
  console.log(await (await fetch('/mock/input.json')).json())
  console.log(await (await fetch('/mock/layer_output.json')).json())
}))().catch(console.error)