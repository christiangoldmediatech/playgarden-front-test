<template>
  <SubscriptionEndDialog />
</template>

<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api'
import SubscriptionEndDialog from '@/components/ui/dialogs/SubscriptionEndDialog/index.vue'

export default defineComponent({
  name: 'TestPage',
  components: {
    SubscriptionEndDialog
  },
  setup () {
    const reactiveData = ref('this is composed')

    return {
      reactiveData
    }
  }
})
</script>

<style lang="saas" scoped></style>
