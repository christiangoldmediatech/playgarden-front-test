<template>
  <v-main class="pos-relative">
    <v-btn
      class="activity-type-back mt-md-4 ml-md-6"
      text
      nuxt
      :to="{ name: 'app-library' }"
    >
      <span>Back</span>
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
    />

    <activity-player />
  </v-main>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, useRoute, computed } from '@nuxtjs/composition-api'
import ActivityTypeContainer from '@/components/app/library/ActivityTypeContainer.vue'
import ActivityTypeHeader from '@/components/app/library/ActivityTypeHeader.vue'
import ActivityPlayer from '@/components/app/activities/ActivityPlayer.vue'
import { useActivity, useLibrary } from '@/composables'

export default defineComponent({
  name: 'ActivityTypeId',

  components: {
    ActivityTypeContainer,
    ActivityTypeHeader,
    ActivityPlayer
  },

  setup (_, ctx) {
    const route = useRoute()
    const loading = ref(false)

    const { activityById, totalById, getActivitiesById } = useActivity()
    const { getAllFavorites } = useLibrary()

    const id = computed(() => parseInt(route.value.params.activityTypeId))
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

    return {
      loading,
      activityById,
      totalById,
      hasActivity,
      handlePlayAll
    }
  }
})
</script>

<style lang="scss">
.activity-type-back {
  position: absolute;
  top: 18px;
  left: 18px;
  background: rgba(92, 92, 92, 0.10);
  border-radius: 4px;
  z-index: 5;

  & span {
    filter: drop-shadow(0px 4px 1px rgba(0, 0, 0, 0.10));
    color: white !important;
  }
}
</style>
