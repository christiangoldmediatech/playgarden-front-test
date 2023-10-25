<template>
  <v-main>
    <div class="pg-w-[90%] pg-mx-auto">
      <v-row class="pg-flex pg-justify-center sm:pg-justify-end pg-my-5">
        <v-col cols="12" lg="11" md="10" sm="10" class="pg-flex pg-justify-end">
          <TutorialBtn @click="onClickTutorialBtn" />
        </v-col>
        <v-col cols="4" lg="1" md="2" sm="2" class="ml-auto">
          <LanguageSelect no-text show-shadow background-color="#FFFFFF" />
        </v-col>
      </v-row>
      <div class="pg-grid pg-grid-cols-1 md:pg-grid-cols-2 pg-gap-5 pg-my-5">
        <section-image
          id="pg-tutorial__step-1"
          :section="section.dashboard"
          :small="$vuetify.breakpoint.mdAndDown"
          @click:play="handleAudioPlay"
          @click="handleClick"
        />

        <section-image
          id="pg-tutorial__step-2"
          :section="section.classes"
          :small="$vuetify.breakpoint.mdAndDown"
          @click:play="handleAudioPlay"
          @click="handleClick"
        />
      </div>

      <div class="pg-grid pg-grid-cols-1 md:pg-grid-cols-5 pg-gap-5 pg-mt-10">
        <section-image
          :section="section.music"
          small
          @click:play="handleAudioPlay"
          @click="handleClick"
        />

        <section-image
          :section="section.cubby"
          small
          @click:play="handleAudioPlay"
          @click="handleClick"
        />

        <section-image
          id="pg-tutorial__step-3"
          :section="section.library"
          small
          @click:play="handleAudioPlay"
          @click="handleClick"
        />

        <section-image
          small
          :section="section.wellbeing"
          @click:play="handleAudioPlay"
          @click="handleClick"
        />

        <section-image
          small
          :section="section.kidscorner"
          @click:play="handleAudioPlay"
          @click="handleClick"
        />
      </div>
    </div>
    <BirthdayVideoDialog />
    <VirtualPreschoolTutorial v-if="isTutorial" />
    <TutorialDialog @close="startIntroDays" @remind="startIntroDays" @start="onDialogStartTutorial" />
  </v-main>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  ref,
  useRouter,
  useRoute,
  useStore
} from '@nuxtjs/composition-api'

import { useAuth, useLanguageHelper } from '@/composables'
import { TypedStore, Child } from '@/models'

import BirthdayVideoDialog from '@/components/features/childBirthday/BirthdayVideoDialog.vue'
import SectionImage from '@/components/app/virtual-preschool/SectionImage.vue'
import { useTutorialQuery, TutorialQueryParams, useTutorialDialog, useTutorialQuiz } from '@/composables/tutorial/use-tutorial.composable'
import VirtualPreschoolTutorial from '@/components/tutorial/pages/VirtualPreschoolTutorial.vue'
import TutorialBtn from '@/components/tutorial/TutorialBtn.vue'
import TutorialDialog from '@/components/tutorial/TutorialDialog.vue'
import LanguageSelect from '@/components/app/user/LanguageSelect.vue'

import type { RawLocation } from 'vue-router'

export default defineComponent({
  name: 'VirtualPreschoolChild',

  components: {
    BirthdayVideoDialog,
    SectionImage,
    VirtualPreschoolTutorial,
    TutorialBtn,
    LanguageSelect,
    TutorialDialog
  },

  setup() {
    const store = useStore<TypedStore>()
    const router = useRouter()
    const route = useRoute()
    const { accessToken } = useAuth({ store })
    const baseRoute =
      process.env.testEnv === 'production'
        ? `${process.env.baseRouteProd}`
        : '/'

    const currentChild = computed(
      (): Utils.Maybe<Child> => store.getters.getCurrentChild?.[0]
    )

    const goToKidsCorner = () => {
      const url = new URL(process.env.kidsCornerUrl as string)
      if (accessToken.value) {
        url.searchParams.append('atoken', accessToken.value)
      }

      if (currentChild.value) {
        url.searchParams.append('child', currentChild.value.id.toString())
      }

      window.open(url.href, '_self')
    }

    const lang = useLanguageHelper()

    const { isTutorial, startIntroDays } = useTutorialQuery({ route, router })
    const section = computed(() => {
      // Tutorial query parameters
      const dashboardQueryParams: TutorialQueryParams = {}
      const liveClassesQueryParams: TutorialQueryParams = {}
      const videoLibraryQueryParams: TutorialQueryParams = {}
      if (isTutorial.value) {
        dashboardQueryParams.tutorial = true
        dashboardQueryParams.tutorialStep = 'step1'
        liveClassesQueryParams.tutorial = true
        liveClassesQueryParams.tutorialStep = 'step1'
        videoLibraryQueryParams.tutorial = true
        videoLibraryQueryParams.tutorialStep = 'step1'
      }

      return {
        dashboard: {
          imageUrl: require('@/assets/png/virtual-preschool/sections-images/dayli_lessons.png'),
          teacherUrl: require('@/assets/png/virtual-preschool/teacher/Miss_Beth-daily lessons.png'),
          title: `${lang.t('virtualPreschool.sections.dashboard.title')}`,
          route: { name: 'app-dashboard', query: dashboardQueryParams },
          message: `${lang.t('virtualPreschool.sections.dashboard.message')}`,
          audio: `${baseRoute}audio/virtual-preschool/Daily lessons.m4a`,
          color: '#359846',
          textColor: '#C9EE9D',
          bubbleText: '#359846'
        },
        kidscorner: {
          imageUrl: require('@/assets/png/virtual-preschool/sections-images/kids_corner.png'),
          teacherUrl: require('@/assets/png/virtual-preschool/teacher/Miss_Katryna-kidscorner.png'),
          title: `${lang.t('virtualPreschool.sections.kidscorner.title')}`,
          route: goToKidsCorner,
          message: `${lang.t('virtualPreschool.sections.kidscorner.message')}`,
          audio: `${baseRoute}audio/virtual-preschool/Kidscorner.m4a`,
          color: '#FCF394',
          textColor: '#AF7E00',
          bubbleText: '#AF7E00'
        },
        classes: {
          imageUrl: require('@/assets/png/virtual-preschool/sections-images/live_classes.png'),
          teacherUrl: require('@/assets/png/virtual-preschool/teacher/Miss_Lucy-Liveclasses.png'),
          title: `${lang.t('virtualPreschool.sections.classes.title')}`,
          route: { name: 'app-live-classes', query: liveClassesQueryParams },
          message: `${lang.t('virtualPreschool.sections.classes.message')}`,
          audio: `${baseRoute}audio/virtual-preschool/Live classes.m4a`,
          color: '#F58E00',
          textColor: '#FEEAA5',
          bubbleText: '#F58E00'
        },
        cubby: {
          imageUrl: require('@/assets/png/virtual-preschool/sections-images/student_cubby.png'),
          teacherUrl: require('@/assets/png/virtual-preschool/teacher/Miss_Ally_cubby.png'),
          title: `${lang.t('virtualPreschool.sections.cubby.title')}`,
          route: {
            name: 'app-student-cubby-puzzle',
            query: { id: currentChild.value?.id }
          },
          message: `${lang.t('virtualPreschool.sections.cubby.message')}`,
          audio: `${baseRoute}audio/virtual-preschool/Cubby.m4a`,
          color: '#FFC648',
          textColor: '#FF8000',
          bubbleText: '#FF8000'
        },
        music: {
          imageUrl: require('@/assets/png/virtual-preschool/sections-images/music.png'),
          teacherUrl: require('@/assets/png/virtual-preschool/teacher/Miss_Emma_Music.png'),
          title: `${lang.t('virtualPreschool.sections.music.title')}`,
          route: { name: 'app-music' },
          message: `${lang.t('virtualPreschool.sections.music.message')}`,
          audio: `${baseRoute}audio/virtual-preschool/Music.m4a`,
          color: '#F6B7D2',
          textColor: '#CF2A5C',
          bubbleText: '#CF2A5C'
        },
        library: {
          imageUrl: require('@/assets/png/virtual-preschool/sections-images/video_library.png'),
          teacherUrl: require('@/assets/png/virtual-preschool/teacher/Miss_Raulbel-Library.png'),
          title: `${lang.t('virtualPreschool.sections.library.title')}`,
          route: { name: 'app-library', query: videoLibraryQueryParams },
          message: `${lang.t('virtualPreschool.sections.library.message')}`,
          audio: `${baseRoute}audio/virtual-preschool/Library.m4a`,
          color: '#BFBFF7',
          textColor: '#8659C6',
          bubbleText: '#8659C6'
        },
        wellbeing: {
          imageUrl: require('@/assets/png/virtual-preschool/sections-images/social_emotional.png'),
          teacherUrl: require('@/assets/png/virtual-preschool/teacher/teacher_well_being.png'),
          title: `${lang.t('virtualPreschool.sections.wellbeing.title')}`,
          route: { name: 'app-learn-play' },
          message: `${lang.t('virtualPreschool.sections.wellbeing.message')}`,
          audio: `${baseRoute}audio/virtual-preschool/Social and emotional.m4a`,
          color: '#B2E68D',
          textColor: '#1A8901',
          bubbleText: '#1A8901'
        }
      }
    })

    type Section = typeof section.value
    type SectionItem = Section[keyof Section]

    const player = ref<HTMLAudioElement>()
    const isBirthdayModalVisible = ref(false)

    onMounted(() => {
      player.value = new Audio()
    })

    const handleAudioPlay = (sectionItem: SectionItem) => {
      if (!player.value) {
        return
      }

      player.value.src = sectionItem.audio
      player.value.play()
    }

    const handleClick = (sectionItem: SectionItem) => {
      const route = sectionItem.route
      if (typeof route === 'function') {
        route()
      } else {
        // @ts-ignore
        router.push(route)
      }
    }

    // Tutorial Dialog
    function onClickTutorialBtn() {
      startTutorial()
    }

    function startTutorial() {
      router.push({
        name: 'app-virtual-preschool',
        query: {
          tutorial: true,
          tutorialStep: 'step1',
          tutorialWelcome: true,
          tutorialVirtualPreschoolRedirect: true
        }
      } as unknown as RawLocation)
    }

    const { getQuizResults, quizResult } = useTutorialQuiz({ store })
    const { dialogLoading, showTutorialDialog, closeTutorialDialog } = useTutorialDialog()
    if (route.value.query.promptTutorial) {
      showTutorialDialog()
    }
    async function onDialogStartTutorial() {
      try {
        dialogLoading.value = true
        await getQuizResults()

        let step = ''

        if (quizResult.structuredLessons) {
          step = 'step1'
        } else if (quizResult.liveClasses) {
          step = 'step2'
        } else if (quizResult.printableWorksheets) {
          step = 'step3'
        } else if (quizResult.educationalVideos) {
          step = 'step4'
        }

        await router.push({
          name: 'app-virtual-preschool',
          query: {
            tutorial: true,
            tutorialStep: step,
            tutorialWelcome: true,
            tutorialIntroDaysRedirect: true
          }
        } as unknown as RawLocation)
      } finally {
        dialogLoading.value = false
        closeTutorialDialog()
      }
    }

    return {
      section,
      goToKidsCorner,
      handleAudioPlay,
      handleClick,
      isBirthdayModalVisible,
      isTutorial,
      onClickTutorialBtn,
      startTutorial,
      onDialogStartTutorial,
      startIntroDays
    }
  }
})
</script>
