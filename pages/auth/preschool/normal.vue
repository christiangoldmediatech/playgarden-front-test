<template>
  <div>
    <StepOne />
  </div>
</template>

<!-- Start of HubSpot Embed Code -->
<script type="text/javascript" id="hs-script-loader" async defer src="//js.hs-scripts.com/23189711.js"></script>

<!-- End of HubSpot Embed Code -->
<script lang="ts">
import { defineComponent, onMounted } from '@nuxtjs/composition-api'
import StepOne from '@/components/app/register/StepOne.vue'
import { useGtm } from '@/composables/web/gtm'
import { useAccessorHelper } from '@/composables'
import { AuthFlow } from '@/composables/users/enums'

export default defineComponent({
  name: 'Parent',

  layout: 'signup',

  components: {
    StepOne
  },

  setup() {
    const store = useAccessorHelper().auth.signup
    const Gtm = useGtm()

    Gtm.parentPage({
      conversionID: '959213252',
      conversionLabel: 'QAn5COr85PoBEMTdsckD'
    })

    onMounted(() => {
      store.SET_AUTH_FLOW(AuthFlow.PRESCHOOL)
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
