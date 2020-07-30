<template>
  <div id="player" />
</template>

<script>
export default {
  name: 'JwPlayer',

  props: {
    file: {
      type: String,
      required: false,
      default: undefined
    },
    playlist: {
      type: Array,
      required: false,
      default: undefined
    },
    image: {
      type: String,
      required: false,
      default: undefined
    },
    description: {
      type: String,
      required: false,
      default: undefined
    },
    title: {
      type: String,
      required: false,
      default: undefined
    },
    nextUpDisplay: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data: () => {
    return {}
  },

  mounted () {
    if (jwplayer) {
      jwplayer('player').setup({
        ...this.$props
      })
    }
  }
}
</script>
