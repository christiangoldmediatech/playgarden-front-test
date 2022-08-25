<template>
  <div>
    <StepOne />
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import StepOne from '@/components/app/register/StepOne.vue'
import { useGtm } from '@/composables/web/gtm'

export default defineComponent({
  name: 'Parent',

  layout: 'signup',

  components: {
    StepOne
  },

  setup() {
    const Gtm = useGtm()

    Gtm.parentPage({
      conversionID: '959213252',
      conversionLabel: 'QAn5COr85PoBEMTdsckD'
    })

    function goToBack() {
      window.open('https://playgardenonline.com/', '_self')
    }

    return {
      goToBack
    }
  }
})
</script>
