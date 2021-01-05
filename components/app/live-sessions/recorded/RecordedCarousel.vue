<template>
  <v-container
    class="background-line"
    :class="{ mobile: $vuetify.breakpoint.xs }"
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
              <span class="font-weight-black text-outline subtitle-text carousel-text text-uppercase pg-letter-spacing category-name" :style="{'--bgColor': color}">
                {{ name }}
              </span>
            </div>

            <!-- <v-btn
              color="primary"
              class="ml-2"
              :small="$vuetify.breakpoint.xs"
              @click.stop="playAll"
            >
              <v-icon left>
                mdi-play
              </v-icon>
              PLAY ALL
            </v-btn> -->
          </v-row>

          <v-row v-if="!$vuetify.breakpoint.xs">
            <v-col
              v-for="recording in recordings"
              :key="`recording-${recording.id}`"
              :cols="12 / limit"
            >
              <recorded-card :entry="recording" />
            </v-col>
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
              v-for="(recording, i) in list"
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
                  <recorded-card
                    :key="`recording-${recording.id}`"
                    :entry="recording"
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
import RecordedCard from './RecordedCard.vue'

export default {
  name: 'RecordedCarousel',

  components: {
    RecordedCard
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
    name: {
      type: String,
      required: true
    },
    recordings: {
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
      return this.recordings.length
    },

    start () {
      return (this.page - 1) * this.limit
    },

    end () {
      return ((this.start + this.limit) < this.total) ? this.start + this.limit : this.total
    },

    list () {
      return this.recordings.slice(this.start, this.end)
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
  &.mobile::before {
    top: calc(90% - 2.5rem); left: 0; right: 0; bottom: 0;
  }
}
.category-name {
  font-weight: 600 !important;
}
</style>
