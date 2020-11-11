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
  name: 'GradesBtn',

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
    },
    lessonId: {
      type: [Number, String],
      required: false,
      default: null
    }
  },

  computed: {},

  methods: {
    onClick () {
      this.dataItem.entityType = this.entityType
      if (this.lessonId) {
        this.dataItem.lessonId = this.lessonId
      }
      this.$nuxt.$emit('open-dialog-progress-report', this.dataItem)
    }
  }
}
</script>
