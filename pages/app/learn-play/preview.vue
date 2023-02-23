<template>
  <v-main class="background-card-learnd-play">
    <div class="pg-pt-24 px-lg-16 mb-3">
      <v-row v-if="!loading">
        <v-col v-if="$vuetify.breakpoint.mdAndUp" cols="2">
          <play-and-learn-menu-top preview-mode />
          <menu-learn-play />
        </v-col>
        <v-col cols="12" md="10">
          <dashboard-learn-play preview-mode />
        </v-col>
      </v-row>
    </div>
  </v-main>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  ref,
  useContext,
  useRoute,
  useRouter,
  useStore
} from '@nuxtjs/composition-api'
import DashboardLearnPlay from '@/components/app/learn-play/DashboardLearnPlay.vue'
import MenuLearnPlay from '@/components/app/learn-play/MenuLearnPlay.vue'
import PlayAndLearnMenuTop from '@/components/app/learn-play/PlayAndLearnMenuTop.vue'
import { useLearnPlayV2 } from '@/composables'

// @ts-ignore
import previewChild from '@/utils/consts/previewChild.json'

export default defineComponent({
  name: 'LearnPlayPreview',
  components: {
    DashboardLearnPlay,
    MenuLearnPlay,
    PlayAndLearnMenuTop
  },
  setup() {
    const loading = ref(true)
    const route = useRoute()
    const { id, token } = route.value.query
    if (!id || !token) {
      return { loading }
    }

    const store = useStore()
    const { $axios } = useContext()
    const playAndLearn = useLearnPlayV2({ store, previewMode: true })
    const router = useRouter()
    onMounted(async () => {
      try {
        playAndLearn.learnPlayData.value = await $axios.$get(
          `/play-and-learn/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )

        playAndLearn.playAndLearnVideos.value = playAndLearn.learnPlayData.value.videos
        playAndLearn.playAndLearnSongs.value = playAndLearn.learnPlayData.value.songs
        playAndLearn.playAndLearnFiles.value = playAndLearn.learnPlayData.value.files
        playAndLearn.playAndLearnWorksheets.value = playAndLearn.learnPlayData.value.worksheets
        playAndLearn.playAndLearnBooks.value = playAndLearn.learnPlayData.value.books

        const curriculumTypes = await $axios.$get('/curriculum-types', {
          headers: { Authorization: `Bearer ${token}` }
        })

        store.commit('admin/curriculum/SET_TYPES', curriculumTypes)
        await store.dispatch('setChild', { value: [previewChild], save: true })
        await router.replace({ name: 'app-learn-play-preview' })
      } finally {
        loading.value = false
      }
    })

    return { loading }
  }
})
</script>
