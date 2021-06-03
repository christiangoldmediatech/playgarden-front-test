<template>
  <v-hover v-slot="{ hover }">
    <v-card
      class="activity-card"
      :style="{
        transform: !isMobile && hover ? 'scale(1.125)' : undefined,
        'z-index': !isMobile && hover ? '1' : undefined
      }"
      width="100%"
      data-test-id="activity-card"
    >
      <card-ribbon
        v-if="viewed"
        text="Viewed"
        data-test-id="activity-card-ribbon"
      />
      <v-img
        class="activity-card-thumbnail"
        content-class=""
        :src="thumbnail"
        data-test-id="activity-card-thumbnail"
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
              data-test-id="activity-card-activity-type-icon"
              :src="activityTypeIcon"
              contain
            />
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-subtitle class="activity-card-sub text-uppercase">
              <span
                data-test-id="activity-card-title"
                class="activity-card-description"
              >
                {{ title }}
              </span>
            </v-list-item-subtitle>
            <v-list-item-title data-test-id="activity-card-teacher" class="font-weight-bold">
              <span class="activity-card-with">with</span> <span class="activity-card-subtitle">{{ teacher }}</span>
            </v-list-item-title>
          </v-list-item-content>

          <v-list-item-action>
            <v-btn
              :class="isFavoriteVideo ? 'is-favorite-video' : 'is-not-favorite-video'"
              icon
              large
              :loading="isLoadingFavorites"
              data-test-id="activity-card-favorite-button"
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
import CardRibbon from '@/components/app/library/CardRibbon.vue'
import { useLibrary } from '@/composables'
import { computed, defineComponent, wrapProperty } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'ActivityCard',

  components: {
    CardRibbon
  },

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
    },

    viewed: {
      type: Boolean,
      required: true
    }
  },

  setup (props) {
    const vuetify = wrapProperty('$vuetify', false)()
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
.activity {
  &-card {
    user-select: none;
    transition: transform .15s ease-in-out;
    position: relative;
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
