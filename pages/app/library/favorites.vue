<template>
  <v-main class="pos-relative">
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
      :icon="require('@/assets/svg/library/favorites.svg')"
      name="Favorites"
      color="#ff051e"
      @play-all="handlePlayAll"
    />

    <favorites-container
      v-if="favorites.length"
      ref="container"
      v-bind="{ favorites }"
      no-header
      expandable
    />

    <activity-player />
  </v-main>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from '@nuxtjs/composition-api'
import FavoritesContainer from '@/components/app/library/FavoritesContainer.vue'
import ActivityTypeHeader from '@/components/app/library/ActivityTypeHeader.vue'
import ActivityPlayer from '@/components/app/activities/ActivityPlayer.vue'
import { useActivity, useLibrary } from '@/composables'

export default defineComponent({
  name: 'Favorites',

  components: {
    FavoritesContainer,
    ActivityTypeHeader,
    ActivityPlayer
  },

  setup () {
    const { favorites, getActivities } = useActivity()
    const { getAllFavorites } = useLibrary()

    // this references `ref="container"` when the component is mounted
    const container = ref<any>(null)

    const handlePlayAll = () => {
      if (container.value) {
        container.value?.handlePlay(0)
      }
    }

    onMounted(async () => {
      if (favorites.value.length === 0) {
        await getActivities()
      }

      getAllFavorites()
    })

    return {
      container,
      favorites,
      handlePlayAll
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
