<template>
  <div class="fill-height pa-4">
    <v-row no-gutters>
      <v-col cols="12" md="8">
        <music-carousel-letter :value="null" />
      </v-col>
      <v-col cols="12" md="">
        filter
      </v-col>
    </v-row>
    <div>
      MSUCISS
    </div>
  </div>
</template>

<script>
import MusicCarouselLetter from '@/components/app/music/MusicLetterCarousel.vue'

export default {
  name: 'MusicSongList',
  components: {
    MusicCarouselLetter
  }
}
</script>

<style lang="scss" scoped>
</style>
