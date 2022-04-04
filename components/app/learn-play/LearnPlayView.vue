<template>
  <v-row>
    <v-col cols="1">
      <menu-learn-play />
    </v-col>
    <v-col cols="11">
      <dashboard-learn-play />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import DashboardLearnPlay from '@/components/app/learn-play/DashboardLearnPlay.vue'
import MenuLearnPlay from '@/components/app/learn-play/MenuLearnPlay.vue'

export default defineComponent({
  name: 'LearnPlayView',
  components: {
    DashboardLearnPlay,
    MenuLearnPlay
  },
  setup() {

  }
})
</script>
