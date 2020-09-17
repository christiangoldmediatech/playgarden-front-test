<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <pg-loading v-if="loading" />

        <v-card v-else elevation="0">
          <v-stepper v-if="!none" v-model="step" class="elevation-0">
            <v-stepper-header v-if="!single">
              <template v-for="({ name, description }, indexOH) in onboardings">
                <v-divider v-if="indexOH" :key="`divider-${indexOH}`" />

                <v-stepper-step
                  :key="`step-header-${indexOH}`"
                  :complete="step > indexOH + 1"
                  :step="indexOH + 1"
                >
                  {{ name }}

                  <small>{{ description }}</small>
                </v-stepper-step>
              </template>
            </v-stepper-header>

            <v-stepper-items>
              <v-stepper-content
                v-for="({ videos }, indexOI) in onboardings"
                :key="indexOI"
                class="pa-4"
                :step="indexOI + 1"
              >
                <video-js-player
                  v-bind="{ videos }"
                  @ready="onPlayerReady"
                  @ended="nextStep"
                />
              </v-stepper-content>
            </v-stepper-items>
          </v-stepper>

          <v-card-actions v-if="!none">
            <v-spacer />

            <template v-if="!single">
              <v-btn
                color="accent"
                :disabled="first"
                large
                :loading="finishing"
                text
                @click="step--"
              >
                PREV
              </v-btn>

              <v-btn v-if="!last" color="primary" large text @click="step++">
                NEXT
              </v-btn>
            </template>

            <v-btn
              v-if="single || last"
              class="text-h6"
              color="primary"
              :loading="finishing"
              text
              @click="onFinish"
            >
              GO TO LESSONS
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { get } from 'lodash'
import { mapActions } from 'vuex'

import VideoJsPlayer from '@/components/video-player/VideoJsPlayer'

export default {
  name: 'Onboarding',

  components: {
    VideoJsPlayer
  },

  data: () => ({
    loading: true,
    finishing: false,
    step: 1,
    onboardings: [],
    player: null
  }),

  computed: {
    first () {
      return this.step === 1
    },

    last () {
      return this.step === this.steps
    },

    none () {
      return !this.onboardings.length
    },

    single () {
      return this.onboardings.length === 1
    },

    steps () {
      return this.onboardings.length
    }
  },

  async created () {
    try {
      // this.onboardings = await this.getOnboardings()
      this.onboardings = [get(await this.getOnboardings(), '0', {})]
    } catch (e) {
    } finally {
      setTimeout(() => {
        if (this.none) {
          this.onFinish()
        } else {
          this.loading = false
        }
      }, 250)
    }
  },

  beforeDestroy () {
    this.player = null
  },

  methods: {
    ...mapActions('auth', ['updateAuthOnboarding']),
    ...mapActions('onboarding', ['getOnboardings']),

    onPlayerReady (player) {
      this.player = player

      const interval = window.setInterval(() => {
        if (this.onboardings.length) {
          const { videos } = this.onboardings[0]
          this.player.loadMedia({
            title: videos.name,
            poster: videos.thumbnail,
            src: {
              src: videos.videoUrl.HLS,
              type: 'application/x-mpegURL'
            }
          })
          window.clearInterval(interval)
        }
      }, 50)
    },

    nextStep () {
      if (this.step < this.steps) {
        this.step++
      }
    },

    async onFinish () {
      this.finishing = true

      try {
        await this.updateAuthOnboarding()

        this.$router.push({ name: 'app-dashboard' })
      } catch (e) {
      } finally {
        this.finishing = false
      }
    }
  }
}
</script>