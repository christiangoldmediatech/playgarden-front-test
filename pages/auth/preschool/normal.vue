<template>
  <div>
    <StepOne />
  </div>
</template>

<head>
  <title>Online Preschool Signup</title>
</head>

<script lang="ts">
import { defineComponent, onMounted } from '@nuxtjs/composition-api'
import StepOne from '@/components/app/register/StepOne.vue'
import { useGtm } from '@/composables/web/gtm'
import { useAccessorHelper } from '@/composables'
import { AuthFlow, Flow } from '@/composables/users/enums'
import { switchCase } from '@babel/types'

export default defineComponent({
  name: 'Parent',
  head() {
    return {
      title: 'Online Preschool Signup'
    }
  },

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
      const options = ['CREDITACARD', 'NOCREDITCARD']
      const randomOption = options[Math.floor(Math.random() * options.length)]
      switch (randomOption) {
        case 'CREDITACARD':
          return store.SET_AUTH_FLOW(AuthFlow.PRESCHOOL)
        case 'NOCREDITCARD':
          store.SET_AB_FLOW(Flow.NOCREDITCARD)
      }
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
