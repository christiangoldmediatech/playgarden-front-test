<template>
  <v-btn
    color="accent"
    icon
    :disabled="disabled"
    :loading="loading"
    @click.stop="onClick"
  >
    <v-icon v-text="'mdi-play'" />
  </v-btn>
</template>

<script>
export default {
  name: 'VideoPreviewBtn',

  props: {
    video: {
      type: Object,
      required: false,
      default: () => ({})
    }
  },

  computed: {
    disabled () {
      return !this.video.status
    },

    loading () {
      return !!(
        this.video.status &&
        ['UPLOADING', 'PROCESSING'].includes(this.video.status)
      )
    }
  },

  methods: {
    onClick () {
      this.$nuxt.$emit('open-video-preview', this.video)
    }
  }
}
</script>
