<template>
  <div class="background-card-learnd-play px-lg-16 mb-3">
    <v-row v-if="!loading">
      <v-col v-if="$vuetify.breakpoint.mdAndUp" cols="2">
        <menu-learn-play preview-mode />
      </v-col>
      <v-col cols="12" md="10">
        <dashboard-learn-play preview-mode />
      </v-col>
    </v-row>
  </div>
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
// @ts-ignore
import previewChild from '@/utils/consts/previewChild.json'
import { useLearnPlayV2 } from '@/composables'

export default defineComponent({
  name: 'LearnPlayIndex',
  layout: 'preview-mode',
  components: {
    DashboardLearnPlay,
    MenuLearnPlay
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
