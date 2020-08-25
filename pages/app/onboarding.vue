<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-row v-if="loading" align="center" fill-height justify="center">
          <v-col class="text-center" cols="4">
            <div>
              <img class="logo-img" src="@/assets/svg/logo.svg">
            </div>

            <v-progress-linear color="primary" indeterminate :size="20" />

            <nuxt />
          </v-col>
        </v-row>

        <v-card v-else>
          <v-card-title>
            Oboarding
          </v-card-title>

          <v-card-text v-if="!none">
            <v-stepper v-model="step">
              <v-stepper-header>
                <template
                  v-for="({ name, description }, indexOH) in onboardings"
                >
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
                  :step="indexOI + 1"
                >
                  <jw-player
                    :file="videos.videoUrl"
                    :title="videos.name"
                    :image="videos.thumbnail"
                    :description="videos.description"
                    @complete="nextStep"
                  />
                </v-stepper-content>
              </v-stepper-items>
            </v-stepper>
          </v-card-text>

          <v-card-actions v-if="!none">
            <v-spacer />

            <template v-if="!single">
              <v-btn
                color="accent"
                :disabled="first"
                :loading="finishing"
                text
                @click="step--"
              >
                PREV
              </v-btn>

              <v-btn v-if="!last" color="primary" text @click="step++">
                NEXT
              </v-btn>
            </template>

            <v-btn
              v-if="single || last"
              color="primary"
              :loading="finishing"
              text
              @click="onFinish"
            >
              FINISH
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Onboarding',

  data: () => ({
    loading: true,
    finishing: false,
    step: 1,
    onboardings: []
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
      this.onboardings = await this.getOnboardings()
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

  methods: {
    ...mapActions('auth', ['updateAuthOnboarding']),

    ...mapActions('onboarding', ['getOnboardings']),

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

<style scoped></style>
