<template>
  <v-row>
    <v-col cols="12">
      <step-three />
    </v-col>
  </v-row>
</template>

<script>

import StepThree from '@/components/app/register/StepThree'

export default {
  name: 'Children',

  components: {
    StepThree
  },

  created () {
    this.$gtm.push({
      event: 'payment_children_page',
      conversionID: '959213252',
      conversionLabel: 'q4IlCNbg0voBEMTdsckD'
    })
  }
}
</script>
