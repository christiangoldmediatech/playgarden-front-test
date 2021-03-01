<template>
  <v-row>
    <v-row no-gutters>
      <v-btn
        color="accent"
        nuxt
        text
        :to="{
          name: 'app-payment-shorter',
          query: { process: 'signup', step: '2' }
        }"
      >
        <v-icon left>
          mdi-less-than
        </v-icon>

        Back
      </v-btn>
    </v-row>
    <v-col cols="12">
      <step-three />
    </v-col>
  </v-row>
</template>

<script>

import StepThree from '@/components/app/register/StepThree'

export default {
  name: 'Shorter',

  components: {
    StepThree
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
    this.currentStep = (this.$route.query.step) ? Number(this.$route.query.step) : 1
  },

  mounted () {
    this.$nuxt.$on('set-current-step', (step) => {
      console.log('step--', step)
      if (step) {
        this.currentStep = step
      }
    })
  },

  beforeDestroy () {
    this.$nuxt.$off('set-current-step')
  },

  methods: {}
}
</script>
