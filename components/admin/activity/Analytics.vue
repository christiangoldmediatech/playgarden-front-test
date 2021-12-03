<template>
  <v-row>
    <v-col cols="4">
      <top-videos :video-list="topVideos" title="Top 40 videos favorites" />
    </v-col>
    <v-col cols="8">
      <pg-select
        v-model="selectedSate"
        clearable
        hide-details
        label="State"
        solo-labeled
        :items="states"
        class="select"
        @change="stateChange(selectedSate)"
      />
      <top-videos class="mx-1" :video-list="topVideosByState" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { useMetrics } from '@/composables/dashboard'
import { TopVideo } from '@/models'
import { defineComponent, onMounted, ref } from '@vue/composition-api'
import TopVideos from './TopVideos.vue'

export default defineComponent({
  name: 'Analytics',
  components: { TopVideos },
  setup() {
    const topVideosByState = ref<TopVideo[]>([])
    const states = ref<string[]>([])
    const selectedSate = ref<string>()
    states.value = ['VIEWED', 'VIDEO_STARTED', 'VIDEO_SKIPPED', 'COMPLETED']
    const { topVideos, getTopFavoritesVideos, getTopVideosByState } = useMetrics()

    const getVideoList = async (params: any) => {
      topVideosByState.value = await getTopVideosByState(params)
    }

    const stateChange = async (val: string) => {
      const params = {
        state: val
      }
      await getVideoList(params)
      topVideosByState.value = await getTopVideosByState(params)
    }

    onMounted(async () => {
      await getTopFavoritesVideos()
      selectedSate.value = states.value[0]
      const params = {
        state: selectedSate.value
      }
      await getVideoList(params)
    })

    return {
      topVideos,
      topVideosByState,
      selectedSate,
      states,
      stateChange
    }
  }

})
</script>
