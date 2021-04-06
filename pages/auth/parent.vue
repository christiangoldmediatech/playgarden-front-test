<template>
  <v-row>
    <v-row no-gutters>
      <v-btn
        color="accent"
        nuxt
        text
      >
        <a
          class="d-block back mb-1 mt-1"
          href="https://playgardenonline.com/"
        >
          <v-icon left>
            mdi-less-than
          </v-icon>
          Back
        </a>
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

  created () {
    this.$gtm.push({
      event: 'parent_page',
      conversionID: '959213252',
      conversionLabel: 'QAn5COr85PoBEMTdsckD'
    })
  },

  methods: {}
}
</script>

<style lang="scss" scoped>
.back {
  color: var(--v-accent-base) !important;
}
</style>
