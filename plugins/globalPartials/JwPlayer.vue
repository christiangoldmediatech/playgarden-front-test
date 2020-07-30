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
    return {
      src: 'https://cdn.jwplayer.com/libraries/Emctu8OT.js'
    }
  },

  mounted () {
    const script = document.createElement('script')
    script.setAttribute('src', this.src)
    script.async = true

    script.onload = () => {
      /*
      const source = {
        file: this.file,
        playlist: this.playlist
      }
      ...source,
        image: this.image,
        title: this.title,
        description: this.description,
        cast: {},
        nextUpDisplay: this.nextUpDisplay
      */
      /* eslint-disable */
      jwplayer('player').setup({
        ...this.$props
      })
      /* eslint-disable */
    }

    document.head.appendChild(script)
  }
}
</script>
