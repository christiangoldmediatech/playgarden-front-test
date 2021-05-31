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
import { useActivity } from '@/composables'

export default defineComponent({
  name: 'Favorites',

  components: {
    FavoritesContainer,
    ActivityTypeHeader,
    ActivityPlayer
  },

  setup (_, ctx) {
    const { favorites, getActivities } = useActivity()

    // this references `ref="container"` when the component is mounted
    const container = ref<any>(null)

    const handlePlayAll = () => {
      if (container.value) {
        container.value?.handlePlay(0)
      }
    }

    ctx.root.$nuxt.$on('library-update-favorites', () => {
      // TODO: Migrate FavoriteMixin to composable.
      //       Each activity card uses the favorites store to know if it is favorite or not
      ctx.root.$store.dispatch('video/getAllFavorites')
    })

    onMounted(async () => {
      await getActivities()
      ctx.root.$store.dispatch('video/getAllFavorites')
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
