<template>
  <v-row>
    <v-row no-gutters>
      <v-btn
        color="accent"
        nuxt
        text
      >
        <v-icon left>
          mdi-less-than
        </v-icon>
        <a
          class="d-block back mb-1 mt-1"
          href="https://playgardenonline.com/"
        >Back</a>
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
  name: 'Parent',

  components: {
    StepOne
  },

  data: vm => ({}),

  computed: {},

  created () {},

  methods: {}
}
</script>

<style lang="scss" scoped>
.back {
  color: var(--v-accent-base) !important;
}
</style>
