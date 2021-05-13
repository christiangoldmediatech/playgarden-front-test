<template>
  <div :id="`activity-type-${activityType.id}-container`">
    <v-container v-if="!noHeader" class="px-0" fluid>
      <div class="pos-relative d-flex align-end px-3">
        <div
          class="act-type-color"
          :style="{ '--act-type-bkg-color': bkgColor }"
        />

        <img class="act-type-icon" :src="activityType.icon">

        <div class="act-type-title">
          {{ activityType.name }}

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
          v-for="(playlist, index) in shownPlaylist"
          :key="`playlist-${playlist.activityId}`"
          class="act-type-activity"
          @click="handlePlay(index)"
        >
          <activity-card
            :video-id="playlist.videoId"
            :thumbnail="playlist.poster"
            :activity-type-icon="activityType.icon"
            :category="activityType.name"
            :title="playlist.description"
            :teacher="playlist.title"
          />
        </div>
      </div>

      <div v-if="total > shownPlaylist.length" class="text-center mt-3">
        <v-btn
          color="accent"
          class="text-none white--text"
          large
          v-bind="{ loading }"
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
import ActivityCard from './ActivityCard.vue'

export default {
  name: 'ActivityTypeContainer',

  components: {
    ActivityCard
  },

  props: {
    activityType: {
      type: Object,
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

    total: {
      type: Number,
      required: true
    },

    limit: {
      type: Number,
      required: false,
      default: 8
    },

    page: {
      type: Number,
      required: false,
      default: 1
    }
  },

  computed: {
    bkgColor () {
      return hexToRgb(this.activityType.color.substring(1))
    },

    end () {
      const end = this.limit * this.page
      if (end > this.total) {
        return this.total
      }
      return end
    },

    shownPlaylist () {
      return jsonCopy(this.activityType.playlist).slice(0, this.end)
    }
  },

  methods: {
    handlePlay (index) {
      this.$nuxt.$emit('open-activity-player', { playlist: this.activityType.playlist, index })
    },

    handleViewMore () {
      if (this.expandable) {
        this.$emit('next-page')
      } else {
        this.$router.push({ name: 'app-library-activityTypeId', params: { activityTypeId: this.activityType.id } })
      }
    }
  }
}
</script>

<style lang="scss">
.act-type {
   &-color {
    position: absolute;
    width: 100%;
    height: 14px;
    left: 0;
    bottom: 8px;
    background-color: rgba(var(--act-type-bkg-color), 0.3);
    z-index: 1;
    @media screen and (min-width: 600px) {
      height: 18px;
      bottom: 10px;
    }
    @media screen and (min-width: 960px) {
      height: 32px;
      bottom: 12px;
    }
  }

  &-icon {
    width: 40px;
    height: 40px;
    margin: 0 12px;
    object-fit: contain;
    object-position: center;
    position: relative;
    z-index: 2;
    @media screen and (min-width: 960px) {
      width: 64px;
      height: 64px;
      margin: 0 16px;
    }
  }

  &-title {
    font-size: 18px;
    font-weight: 700;
    line-height: 1.25;
    letter-spacing: 2px;
    text-align: left;
    color: #606060;
    position: relative;
    z-index: 3;
    text-transform: uppercase;
    @media screen and (min-width: 600px) {
      font-size: 24px;
      letter-spacing: 3px;
    }
    @media screen and (min-width: 960px) {
      font-size: 44px;
      letter-spacing: 6px;
    }
  }

  &-activity {
    width: 100%;
    max-width: 100%;
    padding: 8px;
    transition: transform .15s ease-in-out;
    cursor: pointer;

    @media screen and (min-width: 600px) {
      max-width: 50%;
    }
    @media screen and (min-width: 960px) {
      max-width: 33%;
    }
    @media screen and (min-width: 1264px) {
      max-width: 25%;
    }

    &:hover {
      transform: scale(1.125);
      z-index: 1;
    }
  }
}
</style>
