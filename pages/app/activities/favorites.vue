<template>
  <v-main>
    <v-container>
      <top-bar />
      <activity-title />
    </v-container>
    <video-results v-model="selectedChild" v-bind="{ videos }" />
    <activity-player />
  </v-main>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ActivityPlayer from '@/components/app/activities/ActivityPlayer.vue'
import TopBar from '@/components/app/activities/TopBar.vue'
import VideoResults from '@/components/app/activities/VideoResults.vue'
import ActivityTitle from '@/components/app/activities/ActivityTitle.vue'

export default {
  name: 'Favorites',

  components: {
    ActivityPlayer,
    VideoResults,
    ActivityTitle,
    TopBar
  },

  data: () => {
    return {
      selectedChild: null
    }
  },

  computed: {
    ...mapGetters({ currentChild: 'getCurrentChild' }),
    ...mapGetters('video', { videos: 'getRows' })
  },

  watch: {
    selectedChild (val, oldVal) {
      if (val && val !== oldVal) {
        this.refresh()
      }
    }
  },

  created () {
    this.selectedChild = this.currentChild[0].id
    this.refresh()
  },

  methods: {
    ...mapActions('video', ['getFavorites']),

    refresh () {
      this.getFavorites(this.selectedChild)
    }
  }
}
</script>
