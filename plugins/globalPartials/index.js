import Vue from 'vue'

import UnderlinedSubtitle from './UnderlinedSubtitle'
import UnderlinedTitle from './UnderlinedTitle'

const components = { UnderlinedSubtitle, UnderlinedTitle }

Object.entries(components).forEach(([name, component]) => {
  Vue.component(name, component)
})
