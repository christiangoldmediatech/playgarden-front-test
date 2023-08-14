<script>
import { VDialog } from 'vuetify/lib/components/VDialog'

export default {
  name: 'PgDialog',

  mixins: [VDialog],

  props: {
    zIndex: {
      type: Number,
      required: false,
      default: 2000
    }
  },

  data: () => {
    return {
      stackMinZIndex: 2000
    }
  },

  watch: {
    zIndex: {
      handler(val) {
        this.stackMinZIndex = val
      },
      immediate: true
    }
  }
}
</script>
