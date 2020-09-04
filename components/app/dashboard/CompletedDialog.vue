<template>
  <v-overlay
    :value="value"
    :z-index="300"
  >
    <dashboard-message ref="message" v-bind="{ ...$attrs, returnAction, maxWidth: 800, light: true }">
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
    }
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
