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
          :height="($vuetify.breakpoint.xs) ? '32px' : '48px'"
        >

        <div class="mx-3">
          <span class="font-weight-black text-outline category-text text-uppercase" :style="{'--bgColor': color}">
            {{ categoryName }}
          </span>
        </div>

        <v-btn
          color="primary"
          :small="$vuetify.breakpoint.xs"
          @click.stop="playAll"
        >
          <v-icon left>
            mdi-play
          </v-icon>
          PLAY ALL
        </v-btn>
      </v-row>
      <!--
      <v-row align="center" justify="space-between">
        <v-btn
          text
          :disabled="page === 1"
          @click.stop="moveCarousel(-1)"
        >
          <v-img
            :src="require('@/assets/png/player/left-arrow.svg')"
            max-width="32px"
          />
        </v-btn>

        <v-col>
          <v-row>
            <activity-card
              v-for="activity in list"
              :key="`activity-${activity.id}`"
              :activity="activity.videos"
              :icon="icon"
              :category-name="categoryName"
            />
          </v-row>
        </v-col>

        <v-btn
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
      -->
      <v-row>
        <v-col>
          <v-btn
            text
            :disabled="page === 1"
            @click.stop="moveCarousel(-1)"
          >
            <v-img
              :src="require('@/assets/png/player/left-arrow.svg')"
              max-width="32px"
            />
          </v-btn>
        </v-col>

        <v-col>
          <v-row>
            <activity-card
              v-for="activity in list"
              :key="`activity-${activity.id}`"
              :activity="activity.videos"
              :icon="icon"
              :category-name="categoryName"
            />
          </v-row>
        </v-col>

        <v-col>
          <v-btn
            text
            :disabled="(page * limit) >= total"
            @click.stop="moveCarousel(1)"
          >
            <v-img
              :src="require('@/assets/png/player/right-arrow.svg')"
              max-width="32px"
            />
          </v-btn>
        </v-col>
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
    limit () {
      if (this.$vuetify.breakpoint.sm) { return 2 }
      if (this.$vuetify.breakpoint.xs) { return 1 }
      return 4
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
      const playlist = this.activities.map((activity) => {
        return {
          file: activity.videos.videoUrl.HLS,
          title: activity.videos.name,
          description: activity.videos.description
        }
      })

      const player = this.$refs[`${this._uid}_players`][0].player
      player.load(playlist)
      player.play()
    },

    moveCarousel (direction) {
      this.page += direction
    }
  }
}
</script>

<style lang="scss" scoped>
.category-text {
  font-size: 1.5rem !important;
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
