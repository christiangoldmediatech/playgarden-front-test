<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col cols="12">
        <pg-loading v-if="loading" />
        <v-card v-else elevation="0" class="mt-10">
          <v-row justify="between" align="start">
            <v-col cols="2">
              <v-btn class="pg-ml-[-20px]" plain color="accent" @click.stop="nextStep">
                <v-icon size="50" class="mr-3">
                  mdi-chevron-left
                </v-icon>
                Back to home
              </v-btn>
            </v-col>
            <v-col cols="8">
              <p class="text-center pg-text-[#C399ED] pg-text-3xl pg-font-bold">
                Watch a video on how to use our online preschool!
              </p>
            </v-col>
            <v-col cols="2" />
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
import PgOnboardingVideoPlayer from '@/components/app/onboarding/PgOnboardingVideoPlayer.vue'

export default defineComponent({
  name: 'Onboarding',

  components: {
    PgOnboardingVideoPlayer
  },

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
      checkIfShouldSendShippingAddressNotification:
        Notification.checkIfShouldSendShippingAddressNotification
    }
  },

  computed: {
    ...mapGetters('auth', {
      userInfo: 'getUserInfo'
    }),

    first() {
      return this.step === 1
    },

    last() {
      return this.step === this.steps
    },

    none() {
      return !this.onboardings.length
    },

    single() {
      return this.onboardings.length === 1
    },

    steps() {
      return this.onboardings.length
    }
  },

  async created() {
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

  beforeDestroy() {
    this.player = null
  },

  methods: {
    ...mapActions('auth', ['updateAuthOnboarding']),
    ...mapActions('onboarding', ['getOnboardings']),

    onPlayerReady({ player, videos }) {
      this.player = player

      const interval = window.setInterval(() => {
        if (this.onboardings.length) {
          // const { videos } = this.onboardings[0]
          this.player.loadPlaylist(
            [
              {
                title: videos.name,
                poster: videos.thumbnail,
                src: {
                  url: videos.videoUrl.HLS,
                  type: 'application/x-mpegURL'
                },
                meta: {
                  videoId: 1
                }
              }
            ],
            0
          )
          window.clearInterval(interval)
        }
      }, 50)
    },

    nextStep() {
      this.$router.push({ name: 'app-virtual-preschool' })
      // if (this.step < this.steps) {
      //   this.step++
      // }
    },

    async onFinish() {
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
