<template>
  <div id="player" />
</template>

<script>
export default {
  name: 'JwPlayer',

  props: {
    hls: {
      type: String,
      required: false,
      default: ''
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
      /* eslint-disable */
      jwplayer('player').setup({
        playlist: [
          {
            'hls': this.hls
          }
        ]
      })
      /* eslint-disable */
    }

    document.head.appendChild(script)
  }
}
</script>
