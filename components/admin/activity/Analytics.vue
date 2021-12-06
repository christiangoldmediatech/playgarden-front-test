<template>
  <v-row>
    <v-col cols="4">
      <top-videos class="top-videos" height="700px" :video-list="topVideos" title="Top 40 videos favorites" />
    </v-col>
    <v-col cols="8">
      <pg-select
        v-model="selectedSate"
        clearable
        hide-details
        label="State"
        solo-labeled
        :items="states"
        item-text="name"
        item-value="value"
        class="select mx-1"
        @change="stateChange(selectedSate)"
      />
      <top-videos class="mt-4 top-videos" height="625px" :video-list="topVideosByState" title="Video list" />
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
    const states = ref<any[]>([])
    const selectedSate = ref<any>()
    states.value = [{ name: 'VIEWED', value: 'VIEWED' }, { name: 'STARTED', value: 'VIDEO_STARTED' }, { name: 'SKIPPED', value: 'VIDEO_SKIPPED' }, { name: 'COMPLETED', value: 'COMPLETED' }]
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
