<template>
  <v-container
    class="background-line"
    :style="{'--bgColor': color}"
    fluid
  >
    <v-container>
      <v-row align="end">
        <img
          :src="icon"
          height="48px"
        >

        <div class="mx-3">
          <span class="font-weight-black text-outline category-text text-uppercase" :style="{'--bgColor': color}">
            {{ categoryName }}
          </span>
        </div>

        <v-btn
          color="primary"
          @click.stop="playAll"
        >
          <v-icon left>
            mdi-play
          </v-icon>
          PLAY ALL
        </v-btn>
      </v-row>

      <v-row align="center" justify="space-between">
        <v-btn
          icon
          :disabled="page === 1"
          @click.stop="moveCarousel(-1)"
        >
          <v-icon>
            mdi-arrow-left
          </v-icon>
        </v-btn>

        <v-col>
          <v-row>
            <v-col
              v-for="(activity, i) in list"
              :key="`activity-${activity.id}`"
              cols="3"
            >
              <v-card>
                <jw-player
                  v-if="activity.videos && activity.videos.videoUrl"
                  :ref="`player_${i}`"
                  :file="activity.videos.videoUrl.HLS"
                  :title="activity.videos.name"
                  :description="activity.videos.description"
                  next-up-display
                  @ready="seek"
                  @play="goFullScreen"
                />

                <v-card-actions>
                  <img
                    :src="icon"
                    height="48px"
                  >
                  <div class="ml-2">
                    <span>
                      {{ categoryName }}
                    </span>
                    <br>
                    <span class="font-weight-bold">
                      {{ activity.videos.name }}
                    </span>
                  </div>

                  <v-spacer />

                  <v-btn icon>
                    <v-icon color="#F5737F">
                      mdi-heart-outline
                    </v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-col>

        <v-btn
          icon
          :disabled="(page * limit) > total"
          @click.stop="moveCarousel(1)"
        >
          <v-icon>
            mdi-arrow-right
          </v-icon>
        </v-btn>
      </v-row>
    </v-container>
    <!--
    <div class="d-none">
      <jw-player
        ref="player"
        next-up-display
        @play="goFullScreen"
      />
    </div>
    -->
  </v-container>
</template>

<script>
export default {
  name: 'Carousel',

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
      limit: 4,
      page: 1
    }
  },

  computed: {
    total () {
      return this.activities.length
    },

    list () {
      const start = (this.page - 1) * this.limit
      const end = ((start + this.limit) < this.total) ? start + this.limit : this.total

      return this.activities.slice(start, end)
    }
  },

  methods: {
    playAll () {
      const playlist = this.activities.map((activity) => {
        return {
          file: activity.videos.videoUrl.HLS,
          title: activity.videos.name,
          description: activity.videos.description
        }
      })

      const player = this.$refs.player_0[0].player
      player.load(playlist)
      player.play()
    },

    moveCarousel (direction) {
      this.page += direction
    },

    seek (player) {
      player.seek(0.25)
    },

    goFullScreen ({ player, params }) {
      player.setFullscreen(true)
    }
  }
}
</script>

<style lang="scss" scoped>
.category-text {
  position: relative;
  z-index: 1;
  &::after {
    width: 115%;
    opacity: 0.5;
    position: absolute;
    bottom: 0%;
    left: -7.5%;
    content: "";
    z-index: -1;
    border-bottom: 11px solid var(--bgColor);
    border-radius: 7px;
  }
}

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
