<template>
  <v-hover v-slot="{ hover }">
    <v-card class="activity-card" width="100%">
      <v-img
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
            :class="{ 'activity-card-thumbnail-play-show': hover }"
            src="@/assets/svg/play-button-icon.svg"
          >
        </div>
      </v-img>
      <v-list class="py-0" dense>
        <v-list-item three-line>
          <v-list-item-content>
            <v-list-item-subtitle class="activity-card-sub text-uppercase">
              <span class="activity-card-description title-pre">{{ title }}</span>
            </v-list-item-subtitle>
            <v-list-item-title>
              <span class="activity-card-with text-none">with</span> <span class="activity-card-subtitle">{{ teacher }}</span>
            </v-list-item-title>
          </v-list-item-content>

          <v-list-item-action>
            <v-btn
              icon
              large
              :loading="favoritesLoading"
              @click.stop="handleFavorites"
            >
              <v-icon color="#F5737F">
                <template v-if="isFavorite">
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
import FavoritesMixin from '@/mixins/FavoritesMixin.js'

export default {
  name: 'FavoriteCard',

  mixins: [FavoritesMixin],

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
  }
}
</script>

<style lang="scss">
.title-pre {
  white-space: pre-wrap;
}
</style>
