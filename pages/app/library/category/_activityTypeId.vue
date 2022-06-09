<template>
  <library-layout :loading="isLoading" class="library-category" back-btn>
    <template v-if="result">
      <v-container class="mb-16 d-none d-lg-block">
        <v-row justify="center">
          <library-category-icon
            :border-color="lighterColor"
            v-bind="{ icon }"
          />

          <underlined-title
            font-size="60px"
            font-weight="700"
            line-height="1.5"
            line-color="#68C453"
            :text="name"
          />
        </v-row>
      </v-container>

      <library-video-path
        v-bind="{
          videos: result.activityVideos || [],
          icon,
          color,
          lighterColor
        }"
      />

      <library-video-path-player id="videoPathPlayer" v-bind="{ playlist }" />
    </template>
  </library-layout>
</template>

<script lang="ts">
import {
  defineComponent,
  useRouter,
  useRoute,
  useStore,
  useContext,
  onMounted,
  ref,
  computed
} from '@nuxtjs/composition-api'

import LibraryLayout from '@/components/app/library/LibraryLayout.vue'
import LibraryVideoPath from '@/components/app/library/LibraryVideoPath.vue'
import LibraryCategoryIcon from '@/components/app/library/LibraryCategoryIcon.vue'
import LibraryVideoPathPlayer from '@/components/app/library/LibraryVideoPathPlayer.vue'
import { Video, ActivityType /* TypedStore */ } from '@/models'
import { getHexNonTransparentColor } from '@/utils/colorTools'
import { useFavorites, useLibraryHelpers } from '@/composables'

type LibraryCategoryResponse = {
  activityType: ActivityType
  activityVideos: Video[]
  limit: string
  page: string
  total: number
}

export default defineComponent({
  name: 'LibraryActivityTypePathPage',

  components: {
    LibraryCategoryIcon,
    LibraryVideoPath,
    LibraryLayout,
    LibraryVideoPathPlayer
  },

  setup() {
    const route = useRoute()
    const store = useStore()
    // const typedStore = useStore<TypedStore>()
    const { $axios } = useContext()

    const child = computed(() => store.getters.getCurrentChild[0])
    const result = ref<null | LibraryCategoryResponse>(null)

    // const { currentChildren } = useChild({ store: typedStore })
    const { videoToMediaObject, getValidVideos } = useLibraryHelpers()
    const { curatePlaylist, favoriteVideoIds } = useFavorites()
    const playlist = computed(() => {
      if (result.value?.activityVideos && result.value?.activityVideos.length) {
        const mediaObjects = result.value.activityVideos.map((video, index) => {
          const activity = videoToMediaObject(
            video,
            index,
            result.value?.activityType
          )
          // if (activity.meta) {
          //   activity.meta.type = 'Activities'
          // }
          return activity
        })
        const curated = curatePlaylist(mediaObjects, favoriteVideoIds.value)
        return curated
      }
      return []
    })

    // Get color
    const color = computed(() => {
      if (result.value) {
        return result.value.activityType.color
      }
      return null
    })

    // Get color
    const lighterColor = computed(() => {
      if (color.value) {
        return getHexNonTransparentColor(color.value, 0.6125)
      }
      return null
    })

    // Get icon
    const icon = computed(() => {
      if (result.value) {
        return result.value.activityType.icon
      }
      return null
    })

    // Get icon
    const name = computed(() => {
      if (result.value) {
        return result.value.activityType.name
      }
      return null
    })

    const isLoading = ref(true)
    onMounted(async () => {
      isLoading.value = true
      const activityTypeId = parseInt(route.value.params.activityTypeId)

      if (activityTypeId) {
        const response = (await $axios.$get(
          `/activities/${activityTypeId}/patches/${child.value.id}/filter?limit=50&page=1`
        )) as LibraryCategoryResponse
        response.activityVideos = getValidVideos(response.activityVideos)
        result.value = response
      }
      isLoading.value = false
    })

    // go back to main page
    const router = useRouter()
    function goBack(): void {
      router.push({
        name: 'app-library'
      })
    }

    return {
      result,
      playlist,
      color,
      lighterColor,
      icon,
      name,
      goBack,
      isLoading
    }
  }
})
</script>

<style lang="scss" scoped>
.library-category {
  background-image: url('~assets/jpg/library/paper-background.jpg');
  background-size: 100% auto;
  background-repeat: repeat-y;
  margin-bottom: -12px;
}
</style>
