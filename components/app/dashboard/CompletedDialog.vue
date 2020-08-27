<template>
  <v-dialog
    :value="value"
    max-width="800"
    persistent
    @input="$emit('input', $event)"
  >
    <dashboard-message v-bind="{ ...$attrs, returnAction }">
      <template v-for="(_, slot) of $scopedSlots" v-slot:[slot]="scope">
        <slot :name="slot" v-bind="scope" />
      </template>
    </dashboard-message>
  </v-dialog>
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
      if (val && this.$attrs.timeOut) {
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
