<template>
  <v-btn
    color="accent"
    icon
    @click.stop="onClick"
  >
    <v-icon v-text="'mdi-garage'" />
  </v-btn>
</template>

<script>
export default {
  name: 'ProgressReportBtn',

  props: {
    dataItem: {
      type: Object,
      required: false,
      default: () => ({})
    },
    entityType: {
      type: String,
      required: false,
      default: () => ('')
    }
  },

  computed: {},

  methods: {
    onClick () {
      this.dataItem.entityType = this.entityType
      this.$nuxt.$emit('open-dialog-progress-report', this.dataItem)
    }
  }
}
</script>
