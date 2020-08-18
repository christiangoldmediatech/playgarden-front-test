<template>
  <v-container>
    <v-row>
      <video-card
        v-for="item in videos"
        :key="`favorite-video-${item.id}`"
        :video="item.video"
      />
    </v-row>

    <v-row justify="center">
      <v-col cols="12" sm="10" md="8" lg="6" xl="4">
        <v-btn
          color="primary"
          text
          block
          x-large
          @click.stop="$router.push({ name: 'app-activities' })"
        >
          Return to activities
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import VideoCard from './VideoCard.vue'

export default {
  name: 'VideoResults',

  components: {
    VideoCard
  },

  props: {
    videos: {
      type: Array,
      required: true
    }
  },

  data: () => {
    return {}
  }
}
</script>
