<template>
  <v-card class="learn-play-dashboard pt-4 pt-md-7" elevation="10">
    <!-- Letter and search section -->
    <v-row class="mx-4 mx-md-7" align="center" no-gutters>
      <v-col class="d-md-none" cols="12">
        <menu-mobile />
      </v-col>

      <v-col cols="2" md="auto">
        <div class="my-3 my-md-0">
          <span class="title-dashboard">Letter</span>
        </div>
      </v-col>

      <v-col cols="10">
        <carousel-letter
          id="CarouselLetter"
          :value="curriculumTypeId"
          :is-play-and-learn="true"
          :preview-mode="previewMode"
        />
      </v-col>
    </v-row>

    <v-row v-if="hasPlayAndLearnContent" class="mx-md-1">
      <v-col cols="12">
        <v-col id="videoLesson" cols="12">
          <VideoLessonPlayerLearnPlay :preview-mode="previewMode" />
        </v-col>
      </v-col>

      <v-col cols="12" class="mb-4">
        <!-- WORKSHEETS -->
        <v-col id="worksheets" class="mt-4" cols="12">
          <OfflineWorksheetsLearnPlay :preview-mode="previewMode" />
        </v-col>
      </v-col>

      <v-col cols="12" md="8">
        <!-- DIY PROJECT -->
        <v-col id="diy" cols="12">
          <DiyProjectLearnPlay :preview-mode="previewMode" />
        </v-col>

        <!-- MOBILE ART PROJECT SECTION -->
        <v-col v-if="$vuetify.breakpoint.mobile" id="art-project" cols="12">
          <ArtProjectLearnPlay :preview-mode="previewMode" />
        </v-col>

        <!-- SNACK SECTION -->
        <v-col id="snack" cols="12">
          <SnackSectionLearnPlay :preview-mode="previewMode" />
        </v-col>

        <!-- BOOK SECTION -->
        <v-col id="book" cols="12">
          <BookVideoPlayerLearnPlay :preview-mode="previewMode" />
        </v-col>

        <!-- MOBILE AUDIO PLAYER -->
        <v-col v-if="$vuetify.breakpoint.mobile" id="playlist" cols="12">
          <PlaylistLearnPlay :preview-mode="previewMode" />
        </v-col>
      </v-col>

      <!-- DESKTOP SECOND COLUMN -->
      <v-col v-if="!$vuetify.breakpoint.mobile" cols="4">
        <!-- ART PROJECT -->
        <v-col id="art-project" cols="12">
          <ArtProjectLearnPlay :preview-mode="previewMode" />
        </v-col>

        <!-- AUDIO PLAYER -->
        <v-col id="playlist" cols="12">
          <PlaylistLearnPlay :preview-mode="previewMode" />
        </v-col>
      </v-col>
    </v-row>

    <v-row v-else class="mx-md-1 pa-5" justify="center" align="center">
      <v-col cols="12">
        <v-row justify="center" align="center">
          <v-img :max-width="noContentImgWidth" aspect-ratio="1" :src="require('@/assets/svg/no-content.svg')" />
        </v-row>
        <v-row justify="center" align="center" class="px-0 px-md-16 my-5">
          <p class="no-content-text px-0 px-md-16">
            Our teachers are constantly developing new lessons and we will keep uploading them to the well-being plan as they become available.
          </p>
        </v-row>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onBeforeMount,
  onBeforeUnmount,
  ref,
  useStore,
  watch
} from '@nuxtjs/composition-api'
import CarouselLetter from '@/components/app/all-done/CarouselLetter.vue'
import MenuMobile from '@/components/app/learn-play/MenuMobile.vue'
import VideoLessonPlayerLearnPlay from '@/components/app/learn-play/VideoLessonPlayerLearnPlay.vue'
import BookVideoPlayerLearnPlay from '@/components/app/learn-play/BookVideoPlayerLearnPlay.vue'
import OfflineWorksheetsLearnPlay from '@/components/app/learn-play/OfflineWorksheetsLearnPlay.vue'
import DiyProjectLearnPlay from '@/components/app/learn-play/DiyProjectLearnPlay.vue'
import ArtProjectLearnPlay from '@/components/app/learn-play/ArtProjectLearnPlay.vue'
import SnackSectionLearnPlay from '@/components/app/learn-play/SnackSectionLearnPlay.vue'
import PlaylistLearnPlay from '@/components/app/learn-play/PlaylistLearnPlay.vue'

// Composables
import { useChild, useNuxtHelper, useLearnPlayV2, useVuetifyHelper } from '@/composables'

// Models
import { PlayAndLearn, TypedStore } from '@/models'

export default defineComponent({
  name: 'DashboardLearnPlay',

  components: {
    CarouselLetter,
    MenuMobile,
    OfflineWorksheetsLearnPlay,
    VideoLessonPlayerLearnPlay,
    BookVideoPlayerLearnPlay,
    DiyProjectLearnPlay,
    ArtProjectLearnPlay,
    SnackSectionLearnPlay,
    PlaylistLearnPlay
  },

  props: {
    previewMode: {
      type: Boolean,
      default: false
    }
  },

  setup(props) {
    // Basic helpers
    const store = useStore()
    const $nuxt = useNuxtHelper()
    const childStore = useStore<TypedStore>()
    const nuxt = useNuxtHelper()
    const vuetify = useVuetifyHelper()
    const curriculumTypeId = ref<null | number>(null)

    // All composables
    const child = useChild({ store: childStore })
    const learnPlayV2 = useLearnPlayV2({ store })
    const windowTop = ref(window.top?.screenY)

    // Data variables
    const section = ref('')
    const hasPlayAndLearnContent = ref(true)
    const noContentImgWidth = computed(() => vuetify.breakpoint.mdAndDown ? '90%' : '30%')

    // Watcher
    watch(section, () => {
      scrollMeTo(section.value)
    })

    window.addEventListener('scroll', function() {
      section.value = window.scrollY === 0 ? '' : section.value
    })

    // Functions
    function scrollMeTo(elemId: string) {
      const element = document.getElementById(elemId)
      if (element && window) {
        const top = element.offsetTop
        window.scrollTo(0, top)
      }
    }

    const loadPlayAndLearnByCurriculumTypeId = async (curriculumTypeId: number) => {
      await learnPlayV2.getInfoByCurriculumTypeId(curriculumTypeId)
      await learnPlayV2.getVideosByCurriculumTypeId(curriculumTypeId)
      await learnPlayV2.getSongsByCurriculumTypeId(curriculumTypeId)
      await learnPlayV2.getFilesByCurriculumTypeId(curriculumTypeId)
      await learnPlayV2.getWorksheetsByCurriculumTypeId(curriculumTypeId)
      await learnPlayV2.getBooksByCurriculumTypeId(curriculumTypeId)
      checkIfPlayAndLearnHasContent(learnPlayV2.learnPlayData.value)
      $nuxt.$emit('send-learn-play', learnPlayV2.learnPlayData.value)
      refreshMenuSection()
    }

    const refreshMenuSection = () => {
      curriculumTypeId.value = learnPlayV2.learnPlayData.value.curriculumType.id
      nuxt.$on('menu-section', (id: string) => {
        section.value = id
      })
    }

    const checkIfPlayAndLearnHasContent = (data: PlayAndLearn) => {
      const { songs, worksheets, files, books, videos } = data
      hasPlayAndLearnContent.value = !(songs.length === 0 && worksheets.length === 0 && files.length === 0 && books.length === 0 && videos.length === 0)
    }

    // Life cycle hooks
    onBeforeMount(async () => {
      if (!props.previewMode) {
        await child.get()
        await learnPlayV2.getFirstLearnPlay()
        checkIfPlayAndLearnHasContent(learnPlayV2.learnPlayData.value)
      }
      refreshMenuSection()

      nuxt.$on('show-curriculum-progress', (curriculumTypeId: number) => {
        loadPlayAndLearnByCurriculumTypeId(curriculumTypeId)
      })
    })

    onBeforeUnmount(() => {
      nuxt.$off('menu-section')
      nuxt.$off('show-curriculum-progress')
    })

    return {
      curriculumTypeId,
      hasPlayAndLearnContent,
      noContentImgWidth
    }
  }
})
</script>

<style lang="scss" scoped>
.learn-play-dashboard::v-deep {
  .title-dashboard {
    color: #606060 !important;
    font-size: 24px !important;
    font-weight: bold;

    @media screen and (min-width: 1264px) {
      font-size: 28px;
    }
  }

  .subtitle-dashboard {
    color: #606060 !important;
    font-size: 16px !important;
    font-weight: bold;

    @media screen and (min-width: 1264px) {
      font-size: 22px;
    }
  }

  .mobile-play {
    width: 100% !important;
  }

  .learn-play-video {
    aspect-ratio: 1.555;
  }

  .no-content-text {
    font-weight: 400;
    font-size: 22px;
    line-height: 33px;
    text-align: center;
    color: #606060;
  }
}
</style>
