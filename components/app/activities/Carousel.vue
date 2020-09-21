<template>
  <v-container
    class="background-line"
    :style="{'--bgColor': color}"
    fluid
  >
    <v-container class="pa-0">
      <v-row class="flex-nowrap" align="center" no-gutters>
        <v-btn
          v-if="!$vuetify.breakpoint.xs"
          text
          :disabled="page === 1"
          @click.stop="moveCarousel(-1)"
        >
          <v-img
            :src="require('@/assets/png/player/left-arrow.svg')"
            max-width="32px"
          />
        </v-btn>

        <v-col :id="`cardSpace_${_uid}`">
          <v-row align="end" class="pl-3">
            <img
              :src="icon"
              height="38"
            >

            <div class="px-5">
              <span class="font-weight-black text-outline subtitle-text carousel-text text-uppercase pg-letter-spacing " :style="{'--bgColor': color}">
                {{ categoryName }}
              </span>
            </div>

            <v-btn
              color="primary"
              class="ml-2"
              :small="$vuetify.breakpoint.xs"
              @click.stop="playAll"
            >
              <v-icon left>
                mdi-play
              </v-icon>
              PLAY ALL
            </v-btn>
          </v-row>

          <v-row v-if="!$vuetify.breakpoint.xs">
            <activity-card
              v-for="activity in list"
              :key="`activity-${activity.id}`"
              :activity-id="activity.id"
              :activity="activity.videos"
              :icon="icon"
              :category-name="categoryName"
              :playlist="playlist"
            />
          </v-row>
          <v-carousel
            v-else
            :continuous="false"
            :show-arrows="false"
            hide-delimiter-background
            light
            height="350"
          >
            <v-carousel-item
              v-for="(activity, i) in list"
              :key="i"
            >
              <v-sheet
                height="100%"
                color="transparent"
                tile
              >
                <v-row
                  class="fill-height mb-3"
                  align="center"
                  justify="center"
                >
                  <activity-card
                    :key="`activity-${activity.id}`"
                    :activity-id="activity.id"
                    :activity="activity.videos"
                    :icon="icon"
                    :category-name="categoryName"
                    :playlist="playlist"
                  />
                </v-row>
              </v-sheet>
            </v-carousel-item>
          </v-carousel>
        </v-col>

        <v-btn
          v-if="!$vuetify.breakpoint.xs"
          text
          :disabled="(page * limit) >= total"
          @click.stop="moveCarousel(1)"
        >
          <v-img
            :src="require('@/assets/png/player/right-arrow.svg')"
            max-width="32px"
          />
        </v-btn>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
import ActivityCard from './ActivityCard.vue'

export default {
  name: 'Carousel',

  components: {
    ActivityCard
  },

  props: {
    color: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: true
    },
    categoryName: {
      type: String,
      required: true
    },
    activities: {
      type: Array,
      required: true
    }
  },

  data: () => {
    return {
      page: 1
    }
  },

  computed: {
    playlist () {
      const validActivities = this.activities.filter((activity) => {
        return activity.videos.videoUrl
      })

      return validActivities.map((activity, playlistIndex) => {
        return {
          playlistIndex,
          title: activity.videos.name,
          description: activity.videos.description,
          activityType: activity.activityType,
          curriculumType: activity.curriculumType,
          src: {
            src: activity.videos.videoUrl.HLS,
            type: 'application/x-mpegURL'
          },
          poster: activity.videos.thumbnail,
          activityId: activity.id,
          videoId: activity.videos.id,
          viewed: {
            completed: false
          }
        }
      })
    },

    cardWidth () {
      const breakpoint = this.$vuetify.breakpoint
      if (breakpoint.xs) { return 272 }
      return 400
    },

    limit () {
      if (this.$vuetify.breakpoint.sm) { return 2 }
      if (this.$vuetify.breakpoint.xs) { return this.total }
      return 3
    },

    total () {
      return this.activities.length
    },

    start () {
      return (this.page - 1) * this.limit
    },

    end () {
      return ((this.start + this.limit) < this.total) ? this.start + this.limit : this.total
    },

    list () {
      return this.activities.slice(this.start, this.end)
    }
  },

  watch: {
    limit (val) {
      if (this.start >= this.total) {
        this.page = Math.ceil(this.total / this.limit)
      }
    }
  },

  methods: {
    playAll () {
      this.$nuxt.$emit('open-lesson-activity-player', { playlist: this.playlist, index: 0 })
    },

    moveCarousel (direction) {
      this.page += direction
    }
  }
}
</script>

<style lang="scss" scoped>
.background-line {
  position: relative;
  z-index: 1;
  &::before {
    border-top: 5rem solid var(--bgColor);
    opacity: 0.5;
    content:"";
    margin: 0 auto;
    position: absolute;
    top: calc(75% - 2.5rem); left: 0; right: 0; bottom: 0;
    box-shadow: 0 -1px 6px 0 rgba(0, 0, 0, 0.12);
    z-index: -1;
  }
}
</style>
