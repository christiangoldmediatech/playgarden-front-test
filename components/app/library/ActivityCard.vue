<template>
  <v-hover v-slot="{ hover }">
    <v-card
      class="activity-card"
      :style="{
        transform: !isMobile && hover ? 'scale(1.125)' : undefined
      }"
      width="100%"
    >
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
      <v-list class="activiti-card py-0" dense>
        <v-list-item three-line>
          <v-list-item-avatar tile>
            <v-img
              :src="activityTypeIcon"
              contain
            />
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-subtitle class="activity-card-sub text-uppercase">
              <span class="activity-card-description">{{ title }}</span>
            </v-list-item-subtitle>
            <v-list-item-title class="font-weight-bold">
              <span class="activity-card-with">with</span> <span class="activity-card-subtitle">{{ teacher }}</span>
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
  name: 'ActivityCard',

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

    activityTypeIcon: {
      type: String,
      required: true
    },

    category: {
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

  computed: {
    isMobile () {
      return this.$vuetify.breakpoint.mobile
    }
  }
}
</script>

<style lang="scss">
.activity {
  &-card {
    user-select: none;
    transition: transform .15s ease-in-out;
    &-thumbnail {
      border-bottom-left-radius: 5%;
      border-bottom-right-radius: 5%;
      &-play {
        width: 33%;
        min-width: 64px;
        transition: opacity .2s ease-in-out;
        opacity: 0;

        &-show {
          opacity: 1;
        }
      }
    }
    &-with {
      font-weight: 400 !important;
      color: var(--v-black-base) !important;
      text-transform: lowercase !important;
    }

    &-description {
      font-weight: 600;
    }

    &-subtitle {
      font-weight: 400 !important;
      color: var(--v-black-base) !important;
      text-transform: capitalize !important;
    }

    &-sub {
      min-height: 0px;
      top: 0;
    }
  }
}
.title-pre {
  white-space: pre-wrap;
}
</style>
