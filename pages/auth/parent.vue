<template>
  <div />
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { useSignup } from '@/composables'

export default defineComponent({
  name: 'Parent',
  head() {
    return {
      title: 'Playgarden Prep Online'
    }
  },

  async asyncData ({ route, redirect }) {
    const { getABFlow } = useSignup({ route })
    const abRouteName = await getABFlow()

    redirect({
      name: abRouteName
    })
  }
})
</script>
