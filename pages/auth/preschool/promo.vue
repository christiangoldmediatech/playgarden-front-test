<template>
  <div>
    <StepOne :is-coupon-needed="false" :no-terms="false" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from '@nuxtjs/composition-api'
import StepOne from '@/components/app/register/StepOne.vue'
import { useGtm } from '@/composables/web/gtm'
import { useAccessorHelper } from '@/composables'
import { Flow } from '@/composables/users/enums'

export default defineComponent({
  name: 'Parent',

  layout: 'signup',

  components: {
    StepOne
  },

  setup() {
    const Gtm = useGtm()
    const store = useAccessorHelper().auth.signup

    onMounted(() => {
      store.SET_AB_FLOW(Flow.NOCREDITCARD)
    })

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
