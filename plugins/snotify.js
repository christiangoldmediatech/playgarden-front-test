import Vue from 'vue'
import Snotify, { SnotifyPosition } from 'vue-snotify'

Vue.use(Snotify, {
  toast: {
    position: SnotifyPosition.rightBottom,
    closeOnClick: true
  }
})
