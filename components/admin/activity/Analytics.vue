<template>
  <v-row>
    <v-col cols="4">
      <top-videos class="top-videos" height="700px" :video-list="topVideos" title="Top 40 videos favorites" />
    </v-col>
    <v-col cols="8">
      <pg-select
        v-model="selectedState"
        clearable
        hide-details
        label="State"
        solo-labeled
        :items="states"
        item-text="name"
        item-value="value"
        class="select mx-1"
        @change="stateChange(selectedState)"
      />
      <top-videos class="mt-4 top-videos" height="625px" :video-list="topVideosByState" title="Video list" @load-videos="loadVideos" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { useMetrics } from '@/composables/dashboard'
import { TopVideo, VideoStateEnum } from '@/models'
import { defineComponent, onMounted, ref, watch } from '@vue/composition-api'
import TopVideos from './TopVideos.vue'

export default defineComponent({
  name: 'Analytics',
  components: { TopVideos },
  setup() {
    const topVideosByState = ref<TopVideo[]>([])
    const states = ref<any[]>([])
    const selectedState = ref<string>()
    const page = ref<number>(1)
    states.value = [{ name: 'VIEWED', value: VideoStateEnum.VIEWED }, { name: 'STARTED', value: VideoStateEnum.VIDEO_STARTED }, { name: 'SKIPPED', value: VideoStateEnum.VIDEO_SKIPPED }, { name: 'COMPLETED', value: VideoStateEnum.VIDEO_COMPLETED }]
    const { topVideos, getTopFavoritesVideos, getTopVideosByState } = useMetrics()

    const getVideoList = async (params: any) => {
      topVideosByState.value = await getTopVideosByState(params)
    }

    watch(selectedState, (val) => {
      if (val) {
        page.value = 1
      }
    })

    const stateChange = async (val: string) => {
      const params = {
        state: val,
        page: page.value
      }
      topVideosByState.value = await getTopVideosByState(params)
    }

    const loadVideos = async () => {
      page.value++
      const params = {
        state: selectedState.value,
        page: page.value
      }
      const data = await getTopVideosByState(params)
      topVideosByState.value = [...topVideosByState.value, ...data]
    }

    onMounted(async () => {
      await getTopFavoritesVideos()
      selectedState.value = states.value[0].value
      const params = {
        state: selectedState.value,
        page: page.value
      }
      await getVideoList(params)
    })

    return {
      topVideos,
      topVideosByState,
      selectedState,
      states,
      stateChange,
      loadVideos
    }
  }

})
</script>
