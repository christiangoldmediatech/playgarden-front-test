<template>
  <div />
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { useSignup } from '@/composables'

export default defineComponent({
  name: 'Parent',

  async asyncData ({ route, redirect }) {
    const { setupABFlow } = useSignup({ route })
    const abRouteName = await setupABFlow()

    redirect({
      name: abRouteName
    })
  }
})
</script>
