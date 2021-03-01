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
      <step-one />
    </v-col>
  </v-row>
</template>

<script>

import StepOne from '@/components/app/register/StepOne'

export default {
  name: 'SignupFlow',

  components: {
    StepOne
  },

  data: vm => ({}),

  computed: {},

  created () {},

  methods: {}
}
</script>
