<template>
  <v-main class="pos-relative">
    <featured-video
      v-if="hasFeaturedVideo"
      :video="featuredById"
      go-back
      @play="playFeaturedVideo"
    />

    <v-btn
      class="activity-type-back"
      text
      nuxt
      :to="{ name: 'app-library' }"
    >
      <v-icon left>
        mdi-less-than
      </v-icon>
      Back
    </v-btn>

    <activity-type-header
      v-if="hasActivity"
      :icon="activityById.icon"
      :name="activityById.name"
      :color="activityById.color"
      :data-test-id="`activity-type-header-${activityById.name}`"
      @play-all="handlePlayAll"
    />

    <activity-type-container
      v-if="hasActivity"
      v-bind="{
        activityType: activityById,
        total: totalById,
        limit: totalById,
        loading
      }"
      expandable
      no-header
      @next-page="handleViewMore"
    />

    <activity-player />
  </v-main>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, useRoute, computed } from '@nuxtjs/composition-api'
import FeaturedVideo from '@/components/app/library/FeaturedVideo.vue'
import ActivityTypeContainer from '@/components/app/library/ActivityTypeContainer.vue'
import ActivityTypeHeader from '@/components/app/library/ActivityTypeHeader.vue'
import ActivityPlayer from '@/components/app/activities/ActivityPlayer.vue'
import { useActivity, useLibrary } from '@/composables'

export default defineComponent({
  name: 'ActivityTypeId',

  components: {
    FeaturedVideo,
    ActivityTypeContainer,
    ActivityTypeHeader,
    ActivityPlayer
  },

  setup (_, ctx) {
    const route = useRoute()
    const loading = ref(false)

    const { activityById, featuredById, totalById, getActivitiesById, handleFetchMoreActivityById } = useActivity()
    const { getAllFavorites } = useLibrary()

    const id = computed(() => parseInt(route.value.params.activityTypeId))
    const hasFeaturedVideo = computed(() => !!Object.keys(featuredById.value || {}).length)
    const hasActivity = computed(() => !!Object.keys(activityById.value || {}).length)

    onMounted(async () => {
      loading.value = true
      await getActivitiesById(id.value)
      loading.value = false

      getAllFavorites()
    })

    const handlePlayAll = () => {
      ctx.root.$nuxt.$emit('open-activity-player', {
        playlist: activityById.value.playlist,
        index: 0
      })
    }

    const playFeaturedVideo = () => {
      const featuredId = featuredById.value.id
      const playlist = activityById.value.playlist

      if (!playlist) {
        return
      }

      const index = playlist.findIndex(playItem => playItem.activityId === featuredId)

      ctx.root.$nuxt.$emit('open-activity-player', { playlist, index })
    }

    const handleViewMore = () => {
      handleFetchMoreActivityById(id.value)
    }

    return {
      loading,
      activityById,
      featuredById,
      totalById,
      hasActivity,
      hasFeaturedVideo,
      handlePlayAll,
      playFeaturedVideo,
      handleViewMore
    }
  }
})
</script>

<style lang="scss">
.activity-type-back {
  position: absolute;
  top: 8px;
  left: 8px;
  color: white !important;
  text-transform: none;
  z-index: 5;
}
</style>
