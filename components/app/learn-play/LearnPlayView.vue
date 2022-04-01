<template>
  <v-row>
    <v-col cols="3">
      menu
    </v-col>
    <v-col cols="9">
      <dashboard-learn-play />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import DashboardLearnPlay from '@/components/app/learn-play/DashboardLearnPlay.vue'

export default defineComponent({
  name: 'LearnPlayView',
  components: {
    DashboardLearnPlay
  },
  setup() {

  }
})
</script>
