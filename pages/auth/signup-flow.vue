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
    <v-col cols="12">
      <step-one v-if="getStep === '1'" />
    </v-col>
    <v-col cols="12">
      <step-two v-if="getStep === '2'" />
    </v-col>
  </v-row>
</template>

<script>

import StepOne from '@/components/app/register/StepOne'
import StepTwo from '@/components/app/register/StepTwo'

export default {
  name: 'SignupFlow',

  components: {
    StepOne,
    StepTwo
  },

  data: vm => ({
    currentStep: 1
  }),

  computed: {
    getStep () {
      return this.currentStep
    }
  },

  created () {
    this.currentStep = this.$route.query.step
  },

  methods: {}
}
</script>
