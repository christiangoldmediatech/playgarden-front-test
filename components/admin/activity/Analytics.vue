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
      <top-videos class="mt-4 top-videos" height="625px" :video-list="topVideosByState" title="Video list" @load-videos="loadVideos" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { useMetrics } from '@/composables/dashboard'
import { TopVideo } from '@/models'
import { defineComponent, onMounted, ref, watch } from '@vue/composition-api'
import TopVideos from './TopVideos.vue'

export default defineComponent({
  name: 'Analytics',
  components: { TopVideos },
  setup() {
    const topVideosByState = ref<TopVideo[]>([])
    const states = ref<any[]>([])
    const selectedSate = ref<any>()
    const page = ref<number>(1)
    states.value = [{ name: 'VIEWED', value: 'VIEWED' }, { name: 'STARTED', value: 'VIDEO_STARTED' }, { name: 'SKIPPED', value: 'VIDEO_SKIPPED' }, { name: 'COMPLETED', value: 'COMPLETED' }]
    const { topVideos, getTopFavoritesVideos, getTopVideosByState } = useMetrics()

    const getVideoList = async (params: any) => {
      topVideosByState.value = await getTopVideosByState(params)
    }

    watch(selectedSate, (val) => {
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
        state: selectedSate.value,
        page: page.value
      }
      const data = await getTopVideosByState(params)
      topVideosByState.value = [...topVideosByState.value, ...data]
    }

    onMounted(async () => {
      await getTopFavoritesVideos()
      selectedSate.value = states.value[0].value
      const params = {
        state: selectedSate.value,
        page: page.value
      }
      await getVideoList(params)
    })

    return {
      topVideos,
      topVideosByState,
      selectedSate,
      states,
      stateChange,
      loadVideos
    }
  }

})
</script>
