<template>
  <v-container fluid :class="{ 'ml-4 mt-7 px-15': $vuetify.breakpoint.mdAndUp }">
    <v-row class="mt-15">
      <v-col v-if="$vuetify.breakpoint.mdAndUp" cols="2">
        <menu-learn-play />
      </v-col>
      <v-col cols="12" md="10">
        <dashboard-learn-play />
      </v-col>
    </v-row>
  </v-container>
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
