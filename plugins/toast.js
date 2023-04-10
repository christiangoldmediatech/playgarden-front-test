import Vue from 'vue'
import Toast, { POSITION, TYPE } from 'vue-toastification'

import 'vue-toastification/dist/index.css'
import '@/assets/css/toast.css'

Vue.use(Toast, {
  position: POSITION.TOP_RIGHT,
  hideProgressBar: true,
  icon: false,
  pauseOnFocusLoss: false,
  toastDefaults: {
    [TYPE.SUCCESS]: {
      containerClassName: 'pg-toast-container',
      bodyClassName: ['pg-toast-success', 'pg-toast'],
      closeButtonClassName: ['pg-toast-close', 'pg-toast-close-success']
    },
    [TYPE.ERROR]: {
      containerClassName: 'pg-toast-container',
      bodyClassName: ['pg-toast-error', 'pg-toast'],
      closeButtonClassName: ['pg-toast-close', 'pg-toast-close-error']
    },
    [TYPE.WARNING]: {
      containerClassName: 'pg-toast-container',
      bodyClassName: ['pg-toast-warning', 'pg-toast'],
      closeButtonClassName: ['pg-toast-close', 'pg-toast-close-warning']
    }
  }
}
)
