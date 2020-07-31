import Vue from 'vue'
import { TiptapVuetifyPlugin } from 'tiptap-vuetify'

export default ({ app }) => {
  Vue.use(TiptapVuetifyPlugin, {
    vuetify: app.vuetify,
    iconsGroup: 'mdi'
  })
}
