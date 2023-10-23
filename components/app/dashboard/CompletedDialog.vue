<template>
  <v-overlay
    :value="value"
    :z-index="zIndex"
  >
    <dashboard-message ref="message" v-bind="{ ...$attrs, returnAction, light: true }" :return-text="this.$t('dailyLessons.onlineWorksheet.returnText')">
      <template v-for="(_, slot) of $scopedSlots" v-slot:[slot]="scope">
        <slot :name="slot" v-bind="scope" />
      </template>
    </dashboard-message>
  </v-overlay>
</template>

<script>
import DashboardMessage from './DashboardMessage'

export default {
  name: 'CompletedDialog',

  components: {
    DashboardMessage
  },

  props: {
    value: {
      type: Boolean,
      required: true
    },

    zIndex: {
      type: Number,
      required: false,
      default: 4000
    }
  },

  data: () => {
    return {}
  },

  watch: {
    value (val) {
      if (val && this.$attrs.timeOut !== false) {
        this.$nextTick(() => {
          this.$refs.message.startInterval()
        })
      }

      if (val) {
        document.querySelector('html').style.overflowY = 'hidden'
      } else {
        document.querySelector('html').style.overflowY = 'scroll'
      }
    }
  },

  destroyed() {
    document.querySelector('html').style.overflowY = 'scroll'
  },

  methods: {
    close () {
      this.$refs.message.stopInterval()
      this.$emit('input', false)
    },

    returnAction () {
      if (this.$attrs.returnAction) {
        this.$attrs.returnAction()
      }
      this.close()
    }
  }
}
</script>
