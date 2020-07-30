import Vue from 'vue'

import NotifyEvent from './NotifyEvent'
import UnderlinedSubtitle from './UnderlinedSubtitle'
import UnderlinedTitle from './UnderlinedTitle'
import FileUploader from './file-uploader/FileUploader'
import JwPlayer from './JwPlayer'

const components = { NotifyEvent, UnderlinedSubtitle, UnderlinedTitle, FileUploader, JwPlayer }

Object.entries(components).forEach(([name, component]) => {
  Vue.component(name, component)
})
