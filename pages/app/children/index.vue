<template>
  <div />
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import StepThree from '@/components/app/register/StepThree.vue'
import { useSignup } from '@/composables'
import { UserFlow } from '@/models'

export default defineComponent({
  name: 'Index',

  components: {
    StepThree
  },

  asyncData ({ route, redirect }) {
    const { abFlow } = useSignup({ route })

    switch (abFlow.value) {
      case UserFlow.CREDITCARD:
        redirect({ name: 'app-normal-children', query: { ...route.query } })
        break
      case UserFlow.NOCREDITCARD:
        redirect({ name: 'app-promo-children', query: { ...route.query } })
        break
    }
  }
})
</script>
