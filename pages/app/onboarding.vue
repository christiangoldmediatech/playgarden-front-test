<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col cols="12">
        <pg-loading v-if="loading" />
        <v-card v-else elevation="0">
          <v-row>
            <v-btn class="ml-3" icon @click.stop="nextStep">
              <v-icon>
                mdi-close
              </v-icon>
            </v-btn>
          </v-row>
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
                <pg-onboarding-video-player
                  @ready="onPlayerReady({ player: $event, videos })"
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
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { defineComponent, useStore } from '@nuxtjs/composition-api'
import { mapActions, mapGetters } from 'vuex'
import { useNotification } from '@/composables'
// import PgInlineVideoPlayer from '@/components/pg-video-js-player/PgInlineVideoPlayer.vue'

export default defineComponent({
  name: 'Onboarding',

  // components: {
  //   PgInlineVideoPlayer
  // },

  data: () => ({
    loading: true,
    finishing: false,
    step: 1,
    onboardings: [],
    player: null
  }),

  setup() {
    const store = useStore()
    const Notification = useNotification({ store })

    return {
      checkIfShouldSendShippingAddressNotification: Notification.checkIfShouldSendShippingAddressNotification
    }
  },

  computed: {
    ...mapGetters('auth', {
      userInfo: 'getUserInfo'
    }),

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
      const onboardings = await this.getOnboardings()

      if (Array.isArray(onboardings) && onboardings.length > 0) {
        this.onboardings = [onboardings[0]]
      } else {
        this.onboardings = []
      }
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

    onPlayerReady ({ player, videos }) {
      this.player = player

      const interval = window.setInterval(() => {
        if (this.onboardings.length) {
          // const { videos } = this.onboardings[0]
          this.player.loadPlaylist([
            {
              videoId: 1,
              title: videos.name,
              poster: videos.thumbnail,
              src: {
                src: videos.videoUrl.HLS,
                type: 'application/x-mpegURL'
              }
            }
          ], 0)
          window.clearInterval(interval)
        }
      }, 50)
    },

    nextStep () {
      this.$router.push({ name: 'app-virtual-preschool' })
      // if (this.step < this.steps) {
      //   this.step++
      // }
    },

    async onFinish () {
      this.finishing = true

      try {
        await this.updateAuthOnboarding()
        await this.checkIfShouldSendShippingAddressNotification()

        this.$router.push({ name: 'app-virtual-preschool' })
      } catch (e) {
      } finally {
        this.finishing = false
      }
    }
  }
})
</script>
