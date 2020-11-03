import Vue from 'vue'
import Snotify, { SnotifyPosition } from 'vue-snotify'

Vue.use(Snotify, {
  toast: {
    position: SnotifyPosition.rightTop,
    closeOnClick: true
  }
})
