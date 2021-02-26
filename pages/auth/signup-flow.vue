<template>
  <v-row>
    <v-row no-gutters>
      <v-btn
        color="accent"
        nuxt
        text
        :to="{
          name: 'app-payment-plan',
          query: { process: 'signup', step: '3' }
        }"
      >
        <v-icon left>
          mdi-less-than
        </v-icon>

        Back
      </v-btn>
    </v-row>
    <v-col v-if="getStep === '1'" cols="12">
      <step-one />
    </v-col>
    <v-col v-if="getStep === '2'" cols="12">
      <step-two />
    </v-col>
    <v-col v-if="getStep === '3'" cols="12">
      <step-three />
    </v-col>
  </v-row>
</template>

<script>

import StepOne from '@/components/app/register/StepOne'
import StepTwo from '@/components/app/register/StepTwo'
import StepThree from '@/components/app/register/StepThree'

export default {
  name: 'SignupFlow',

  components: {
    StepOne,
    StepTwo,
    StepThree
  },

  data: vm => ({
    currentStep: 1
  }),

  computed: {
    getStep () {
      // this.currentStep = (this.$route.query.step) ? this.$route.query.step : 1
      return this.currentStep
    }
  },

  created () {
    this.currentStep = this.$route.query.step
  },

  methods: {}
}
</script>
