<template>
  <v-hover v-slot="{ hover }">
    <v-card
      class="activity-card"
      :style="{
        transform: !isMobile && hover ? 'scale(1.125)' : undefined,
        'z-index': !isMobile && hover ? '1' : undefined
      }"
      width="100%"
    >
      <v-img
        data-test-id="favorite-card-thumbnail"
        class="activity-card-thumbnail"
        content-class=""
        :src="thumbnail"
        cover
        position="center"
        max-width="100%"
        aspect-ratio="1.474"
      >
        <div class="fill-height d-flex align-center justify-center">
          <img
            class="activity-card-thumbnail-play"
            :class="{ 'activity-card-thumbnail-play-show': hover || isMobile }"
            src="@/assets/svg/play-button-icon.svg"
          >
        </div>
      </v-img>
      <v-list class="py-0" dense>
        <v-list-item three-line>
          <v-list-item-content>
            <v-list-item-subtitle class="activity-card-sub text-uppercase">
              <span
                class="activity-card-description title-pre"
                data-test-id="favorite-card-title"
              >{{ title }}</span>
            </v-list-item-subtitle>
            <v-list-item-title data-test-id="favorite-card-teacher">
              <span class="activity-card-with text-none">with</span> <span class="activity-card-subtitle">{{ teacher }}</span>
            </v-list-item-title>
          </v-list-item-content>

          <v-list-item-action>
            <v-btn
              icon
              large
              :loading="isLoadingFavorites"
              @click.stop="handleFavorite"
            >
              <v-icon color="#F5737F">
                <template v-if="isFavoriteVideo">
                  mdi-heart
                </template>
                <template v-else>
                  mdi-heart-outline
                </template>
              </v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-card>
  </v-hover>
</template>

<script>
import { defineComponent, computed } from '@nuxtjs/composition-api'
import { useLibrary, useVuetifyHelper } from '@/composables'

export default defineComponent({
  name: 'FavoriteCard',

  props: {
    videoId: {
      type: Number,
      required: true
    },

    thumbnail: {
      type: String,
      required: true
    },

    title: {
      type: String,
      required: true
    },

    teacher: {
      type: String,
      required: true
    }
  },

  setup (props) {
    const vuetify = useVuetifyHelper()
    const isMobile = computed(() => vuetify.breakpoint.mobile)

    const {
      isLoadingFavorites,
      handleFavorite,
      isFavoriteVideo
    } = useLibrary(props.videoId)

    return {
      isMobile,
      isLoadingFavorites,
      handleFavorite,
      isFavoriteVideo
    }
  }
})
</script>

<style lang="scss">
.title-pre {
  white-space: pre-wrap;
}
</style>
