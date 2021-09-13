<template>
  <div>
    <p>dddd</p>
    <pg-video-player inline @ready="onPlayerReady" />
    <p>dddd</p>
  </div>
</template>

<script>
// import VideoPreviewBtn from '@/components/admin/video-preview/VideoPreviewBtn.vue'
export default {
  name: 'BirthdayWish',
  data: () => {
    return {
      dialog: false,
      title: '',
      player: null
    }
  },
  methods: {
    onPlayerReady (player) {
      this.player = player
      const t = {
        url: '/test.mp4',
        type: 'video/mp4'
      }

      player.loadPlaylist([{ title: 'ss', src: t }])
    }
  }
}
</script>

<style>

</style>
