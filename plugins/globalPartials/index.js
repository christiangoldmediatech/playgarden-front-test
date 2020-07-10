import Vue from 'vue'

import NotifyEvent from './NotifyEvent'
import UnderlinedSubtitle from './UnderlinedSubtitle'
import UnderlinedTitle from './UnderlinedTitle'

const components = { NotifyEvent, UnderlinedSubtitle, UnderlinedTitle }

Object.entries(components).forEach(([name, component]) => {
  Vue.component(name, component)
})
