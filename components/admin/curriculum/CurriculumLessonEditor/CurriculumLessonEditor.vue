<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-text>
            <v-stepper v-model="currentStep">
              <v-stepper-header>
                <v-stepper-step :complete="currentStep > 1" step="1" />

                <v-divider />

                <v-stepper-step :complete="currentStep > 2" step="2" />

                <v-divider />

                <v-stepper-step :complete="currentStep > 3" step="3" />

                <v-divider />

                <v-stepper-step :complete="currentStep > 4" step="4" />

                <v-divider />

                <v-stepper-step step="5" />
              </v-stepper-header>

              <v-stepper-items>
                <v-stepper-content step="1">
                  <step-one
                    v-if="currentStep === 1"
                    :lesson-id="lessonId"
                    @click:cancel="
                      $router.push({ name: 'admin-curriculum-management' })
                    "
                    @click:submit="onSubmit"
                  />
                </v-stepper-content>

                <v-stepper-content step="2">
                  <step-two v-if="currentStep === 2" @click:submit="onSubmit" />
                </v-stepper-content>

                <v-stepper-content step="3" />

                <v-stepper-content step="4" />

                <v-stepper-content step="5" />
              </v-stepper-items>
            </v-stepper>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import StepOne from './StepOne'
import StepTwo from './StepTwo'

export default {
  name: 'CurriculumLessonEditor',

  components: { StepOne, StepTwo },

  data: vm => ({
    currentStep: parseInt(vm.$route.query.step || 1)
  }),

  computed: {
    lessonId () {
      return this.$route.query.id ? parseInt(this.$route.query.id) : null
    }
  },

  methods: {
    onSubmit (lesson) {
      switch (this.currentStep) {
        case 1:
          this.currentStep++
          this.setQuery({ id: lesson.id, step: this.currentStep })
          break
      }
    },

    setQuery (query = {}) {
      this.$router.push({ query: { ...query, _time: new Date().getTime() } })
    }
  }
}
</script>
