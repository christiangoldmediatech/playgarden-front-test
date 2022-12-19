<template>
  <v-main>
    <v-container fluid class="pg-pt-24 px-lg-16 mb-3">
      <div>
        <v-row>
          <v-col v-if="$vuetify.breakpoint.mdAndUp" cols="2">
            <play-and-learn-menu-top />
            <menu-learn-play />
          </v-col>
          <v-col cols="12" md="10">
            <dashboard-learn-play />
          </v-col>
        </v-row>
      </div>
    </v-container>
  </v-main>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import DashboardLearnPlay from '@/components/app/learn-play/DashboardLearnPlay.vue'
import MenuLearnPlay from '@/components/app/learn-play/MenuLearnPlay.vue'
import PlayAndLearnMenuTop from '@/components/app/learn-play/PlayAndLearnMenuTop.vue'

export default defineComponent({
  name: 'LearnPlayIndex',
  components: {
    DashboardLearnPlay,
    MenuLearnPlay,
    PlayAndLearnMenuTop
  }
})
</script>
