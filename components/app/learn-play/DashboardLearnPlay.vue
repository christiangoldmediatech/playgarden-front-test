<template>
  <v-card class="learn-play-dashboard pt-4 pt-md-7" elevation="10">
    <!-- Letter and search section -->
    <v-row class="mx-4 mx-md-7" align="center" no-gutters>
      <v-col class="d-md-none" cols="12">
        <menu-mobile />
      </v-col>

      <v-col cols="12" md="auto">
        <div class="my-3 my-md-0">
          <span class="title-dashboard">Letter</span>
        </div>
      </v-col>

      <v-col cols="12" md="6" lg="8" xl="10">
        <carousel-letter id="CarouselLetter" :value="curriculumTypeId" />
      </v-col>

      <v-col class="d-none d-md-block flex-grow-1 flex-shrink-0" cols="12" md="auto">
        <pg-text-field
          label="Search"
          solo-labeled
          hide-details
          block
        />
      </v-col>
    </v-row>

    <v-row class="mx-md-1">
      <v-col id="videoLesson" cols="12" md="8">
        <v-col cols="12">
          <VideoLessonPlayerLearnPlay />
        </v-col>

        <!-- MOBILE WORKSHEETS -->
        <v-col v-if="$vuetify.breakpoint.mobile" id="worksheets" cols="12">
          <OfflineWorksheetsLearnPlay />
        </v-col>

        <!-- DIY PROJECT -->
        <v-col id="diy" cols="12">
          <DiyProjectLearnPlay />
        </v-col>

        <!-- MOBILE ART PROJECT SECTION -->
        <v-col v-if="$vuetify.breakpoint.mobile" id="art-project" cols="12">
          <ArtProjectLearnPlay />
        </v-col>

        <!-- SNACK SECTION -->
        <v-col id="snack" cols="12">
          <SnackSectionLearnPlay />
        </v-col>

        <!-- BOOK SECTION -->
        <v-col id="book" cols="12">
          <BookVideoPlayerLearnPlay />
        </v-col>

        <!-- MOBILE AUDIO PLAYER -->
        <v-col v-if="$vuetify.breakpoint.mobile" id="playlist" cols="12">
          <AudioPlayerLearnPlay />
        </v-col>
      </v-col>

      <!-- DESKTOP SECOND COLUMN -->
      <v-col
        v-if="!$vuetify.breakpoint.mobile"
        cols="4"
      >
        <!-- WORKSHEETS -->
        <v-col id="worksheets" cols="12">
          <OfflineWorksheetsLearnPlay />
        </v-col>

        <!-- ART PROJECT -->
        <v-col id="art-project" cols="12">
          <ArtProjectLearnPlay />
        </v-col>

        <!-- AUDIO PLAYER -->
        <v-col id="playlist" cols="12">
          <AudioPlayerLearnPlay />
        </v-col>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, onBeforeUnmount, ref, useStore, watch } from '@nuxtjs/composition-api'
import CarouselLetter from '@/components/app/all-done/CarouselLetter.vue'
import MenuMobile from '@/components/app/learn-play/MenuMobile.vue'
import VideoLessonPlayerLearnPlay from '@/components/app/learn-play/VideoLessonPlayerLearnPlay.vue'
import BookVideoPlayerLearnPlay from '@/components/app/learn-play/BookVideoPlayerLearnPlay.vue'
import OfflineWorksheetsLearnPlay from '@/components/app/learn-play/OfflineWorksheetsLearnPlay.vue'
import DiyProjectLearnPlay from '@/components/app/learn-play/DiyProjectLearnPlay.vue'
import ArtProjectLearnPlay from '@/components/app/learn-play/ArtProjectLearnPlay.vue'
import SnackSectionLearnPlay from '@/components/app/learn-play/SnackSectionLearnPlay.vue'
import AudioPlayerLearnPlay from '@/components/app/learn-play/AudioPlayerLearnPlay.vue'

// Composables
import { useChild, useNuxtHelper, useLearnPlayV2 } from '@/composables'

// Models
import { TypedStore } from '@/models'

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
    AudioPlayerLearnPlay
  },

  setup() {
    // Basic helpers
    const store = useStore()
    const childStore = useStore<TypedStore>()
    const nuxt = useNuxtHelper()
    const curriculumTypeId = ref<null | number>(null)

    // All composables
    const child = useChild({ store: childStore })
    const learnPlayV2 = useLearnPlayV2({ store })

    // Data variables
    const section = ref('videoLesson')

    // Watcher
    watch(section, () => {
      scrollMeTo(section.value)
    })

    // Functions
    function scrollMeTo (elemId: string) {
      const element = document.getElementById(elemId)
      if (element && window) {
        const top = element.offsetTop
        window.scrollTo(0, top)
      }
    }

    // Life cycle hooks
    onBeforeMount(async () => {
      await child.get()
      await learnPlayV2.getFirstLearnPlay()
      curriculumTypeId.value = learnPlayV2.learnPlayData.value.curriculumType.id
      nuxt.$on('menu-section', (id: string) => {
        section.value = id
      })
    })

    onBeforeUnmount(() => {
      nuxt.$off('menu-section')
    })

    return {
      curriculumTypeId
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
}
</style>
