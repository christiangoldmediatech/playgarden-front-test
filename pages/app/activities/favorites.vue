<template>
  <v-main>
    <v-container>
      <top-bar />
      <activity-title />
    </v-container>
    <video-results v-bind="{ videos }" />
    <video-player />
  </v-main>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import VideoPlayer from '@/components/app/activities/VideoPlayer.vue'
import TopBar from '@/components/app/activities/TopBar.vue'
import VideoResults from '@/components/app/activities/VideoResults.vue'
import ActivityTitle from '@/components/app/activities/ActivityTitle.vue'

export default {
  name: 'Favorites',

  components: {
    VideoPlayer,
    VideoResults,
    ActivityTitle,
    TopBar
  },

  data: () => {
    return {
      activities: []
    }
  },

  computed: {
    ...mapGetters({ children: 'getCurrentChild' }),
    ...mapGetters('video', { videos: 'getRows' })
  },

  created () {
    this.getAllFavorites()
  },

  methods: {
    ...mapActions('video', ['getAllFavorites'])
  }
}
</script>
