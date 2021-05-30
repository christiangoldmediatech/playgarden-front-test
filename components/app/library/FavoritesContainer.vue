<template>
  <div id="activity-type-favorites-container">
    <v-container v-if="!noHeader" class="px-0" fluid>
      <div class="pos-relative d-flex align-end px-3">
        <div
          class="act-type-color"
          :style="{ '--act-type-bkg-color': bkgColor }"
        />

        <img class="act-type-icon" src="@/assets/svg/library/favorites.svg">

        <div class="act-type-title">
          Favorites

          <v-btn
            class="ml-6"
            color="primary"
            :small="$vuetify.breakpoint.xsOnly"
            :x-large="$vuetify.breakpoint.mdAndUp"
            @click="handlePlay(0)"
          >
            <v-icon left>
              mdi-play
            </v-icon>
            <template v-if="$vuetify.breakpoint.smAndUp">
              Play
            </template>
            All
          </v-btn>
        </div>
      </div>
    </v-container>

    <v-container>
      <div class="d-flex flex-wrap justify-md-center justify-lg-start">
        <div
          v-for="(activity, index) in shownFavorites"
          :key="`activity-type-favorite-activity-${activity.id}`"
          data-test-id="favorite-card"
          class="act-type-activity"
          @click="handlePlay(index)"
        >
          <favorite-card
            :video-id="activity.video.id"
            :thumbnail="activity.video.thumbnail"
            :title="activity.video.description"
            :teacher="activity.video.name"
          />
        </div>
      </div>

      <div
        v-if="shownFavorites.length === 0 && !initialFavoritesLoading"
        class="d-flex align-center justify-center flex-column"
      >
        <img src="@/assets/svg/library/favorites.svg" width="128px">

        <div class="no-favorites mt-6">
          Add your favorite videos here, by clicking on their Heart icons.
        </div>
      </div>

      <div v-if="total > shownFavorites.length" class="text-center mt-3">
        <v-btn
          color="accent"
          class="text-none white--text"
          large
          v-bind="{ loading }"
          data-test-id="favorite-container-view-more-button"
          @click="handleViewMore"
        >
          <v-icon left>
            mdi-eye
          </v-icon>
          View more
        </v-btn>
      </div>
    </v-container>
  </div>
</template>

<script>
import { hexToRgb } from '@/utils/colorTools'
import { jsonCopy } from '@/utils/objectTools.js'
import FavoriteCard from './FavoriteCard.vue'

export default {
  name: 'FavoritesContainer',

  components: {
    FavoriteCard
  },

  props: {
    favorites: {
      type: Array,
      required: true
    },

    expandable: {
      type: Boolean,
      required: false,
      default: false
    },

    loading: {
      type: Boolean,
      required: false,
      default: false
    },

    noHeader: {
      type: Boolean,
      required: false,
      default: false
    },

    initialFavoritesLoading: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data: () => {
    return {
      color: '#ff051e',
      limit: 8,
      page: 1
    }
  },

  computed: {
    bkgColor () {
      return hexToRgb(this.color.substring(1))
    },

    total () {
      return this.favorites.length
    },

    end () {
      const end = this.limit * this.page
      if (end > this.total) {
        return this.total
      }
      return end
    },

    shownFavorites () {
      return jsonCopy(this.favorites).slice(0, this.end)
    },

    playlist () {
      const playlist = []

      this.favorites.forEach((activity, playlistIndex) => {
        playlist.push({
          playlistIndex,
          title: activity.video.description,
          description: 'With ' + activity.video.name,
          activityType: activity.video.activityType,
          curriculumType: activity.curriculumType,
          src: {
            src: activity.video.videoUrl.HLS,
            type: 'application/x-mpegURL'
          },
          poster: activity.video.thumbnail,
          activityId: activity.id,
          videoId: activity.video.id,
          viewed: {
            completed: false
          },
          favorites: true
        })
      })

      return playlist
    }
  },

  methods: {
    handlePlay (index) {
      this.$nuxt.$emit('open-activity-player', { playlist: this.playlist, index })
    },

    handleViewMore () {
      if (this.expandable) {
        this.page++
      } else {
        this.$router.push({ name: 'app-library-favorites' })
      }
    }
  }
}
</script>

<style lang="scss">
.no-favorites {
  font-size: 20px;
  font-weight: 500;
  line-height: 1.25;
  text-align: center;
  color: #606060;
  @media screen and (min-width: 1264px) {
    font-size: 30px;
  }
}
</style>
