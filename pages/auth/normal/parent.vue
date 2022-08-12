<template>
  <div>
    <StepOne />
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { useGtmHelper } from '@/composables'
import StepOne from '@/components/app/register/StepOne.vue'

export default defineComponent({
  name: 'Parent',

  layout: 'signup',

  components: {
    StepOne
  },

  setup() {
    const gtm = useGtmHelper()

    const goToBack = () => {
      window.open('https://playgardenonline.com/', '_self')
    }

    gtm.push({
      event: 'parent_page',
      conversionID: '959213252',
      conversionLabel: 'QAn5COr85PoBEMTdsckD'
    })

    return {
      goToBack
    }
  }
})
</script>
