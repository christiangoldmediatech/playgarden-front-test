<template>
  <v-container fluid class="background-card-learnd-play">
    <learn-play-view />
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import LearnPlayView from '@/components/app/learn-play/LearnPlayView.vue'

export default defineComponent({
  name: 'LearnPlayIndex',
  components: {
    LearnPlayView
  },
  setup() {

  }
})
</script>
