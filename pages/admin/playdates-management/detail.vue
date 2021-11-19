<template>
  <playdate-view />
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import PlaydateView from '~/components/admin/playdates/PlaydateView.vue'
export default defineComponent({
  name: 'Detail',
  layout: 'admin',
  components: {
    PlaydateView
  }
})
</script>
