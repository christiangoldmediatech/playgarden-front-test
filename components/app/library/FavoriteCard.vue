<template>
  <v-hover v-slot="{ hover }">
    <v-card
      class="activity-card"
      :style="{
        transform: !isMobile && hover ? 'scale(1.125)' : undefined
      }"
      width="100%"
    >
      <card-ribbon v-if="viewed" text="Viewed" />
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
            :class="{ 'activity-card-thumbnail-play-show': hover || isMobile }"
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
import CardRibbon from '@/components/app/library/CardRibbon.vue'
import FavoritesMixin from '@/mixins/FavoritesMixin.js'

export default {
  name: 'FavoriteCard',

  components: {
    CardRibbon
  },

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
    },

    viewed: {
      type: Boolean,
      required: true
    }
  },

  computed: {
    isMobile () {
      return this.$vuetify.breakpoint.mobile
    }
  }
}
</script>

<style lang="scss">
.title-pre {
  white-space: pre-wrap;
}
</style>
