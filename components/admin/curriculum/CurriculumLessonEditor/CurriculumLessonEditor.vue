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

                <v-stepper-step :complete="currentStep > 5" step="5" />

                <v-divider />

                <v-stepper-step step="6" />
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
                  <step-two
                    v-if="currentStep === 2"
                    :lesson-id="lessonId"
                    @click:submit="onSubmit"
                  />
                </v-stepper-content>

                <v-stepper-content step="3">
                  <step-three
                    v-if="currentStep === 3"
                    :lesson-id="lessonId"
                    @click:submit="onSubmit"
                  />
                </v-stepper-content>

                <v-stepper-content step="4">
                  <step-four
                    v-if="currentStep === 4"
                    :lesson-id="lessonId"
                    @click:submit="onSubmit"
                  />
                </v-stepper-content>

                <v-stepper-content step="6">
                  <step-six
                    v-if="currentStep === 6"
                    :lesson-id="lessonId"
                    @click:submit="onSubmit"
                  />
                </v-stepper-content>
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
import StepThree from './StepThree'
import StepFour from './StepFour'
import StepSix from './StepSix'

export default {
  name: 'CurriculumLessonEditor',

  components: {
    StepOne,
    StepTwo,
    StepThree,
    StepFour,
    StepSix
  },

  data: vm => ({
    currentStep: parseInt(vm.$route.query.step || 1),
    lessonId: vm.$route.query.lessonId
      ? parseInt(vm.$route.query.lessonId)
      : null
  }),

  watch: {
    '$route.query.step'(v) {
      this.currentStep = parseInt(v || 1)
    }
  },

  methods: {
    onSubmit(lesson) {
      switch (this.currentStep) {
        case 1:
          this.lessonId = lesson.id
          this.currentStep++
          this.setQuery({ lessonId: lesson.id, step: this.currentStep })
          break

        case 2:
        case 3:
        case 4:
        case 5:
          this.currentStep++
          this.setQuery({ lessonId: this.lessonId, step: this.currentStep })
          break

        case 6:
          this.$snotify.success(
            'Your lesson has been successfully saved!',
            'Congratulations'
          )

          this.$router.push({
            name: 'admin-curriculum-management'
          })
          break
      }
    },

    setQuery(query = {}) {
      this.$router.push({ query: { ...query, _time: new Date().getTime() } })
    }
  }
}
</script>
