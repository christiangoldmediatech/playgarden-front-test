<template>
  <v-row>
    <v-row no-gutters>
      <v-btn
        color="accent"
        nuxt
        text
        :to="{
          name: 'app-signup-flow',
          query: { process: 'signup', step: '1' }
        }"
      >
        <v-icon left>
          mdi-less-than
        </v-icon>

        Back
      </v-btn>
    </v-row>
    <v-col cols="12">
      <step-two />
    </v-col>
  </v-row>
</template>

<script>

import StepTwo from '@/components/app/register/StepTwo'

export default {
  name: 'Shorter',

  components: {
    StepTwo
  },

  data: vm => ({
    currentStep: 2
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
