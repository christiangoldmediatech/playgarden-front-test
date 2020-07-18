import Vue from 'vue'

import NotifyEvent from './NotifyEvent'
import UnderlinedSubtitle from './UnderlinedSubtitle'
import UnderlinedTitle from './UnderlinedTitle'
import FileUploader from './FileUploader'

const components = { NotifyEvent, UnderlinedSubtitle, UnderlinedTitle, FileUploader }

Object.entries(components).forEach(([name, component]) => {
  Vue.component(name, component)
})
