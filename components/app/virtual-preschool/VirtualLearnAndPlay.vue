<template>
  <v-main>
    <div class="pg-w-[90%] pg-mx-auto pg-my-5">
      <v-row class="pg-flex pg-justify-center sm:pg-justify-end pg-my-5">
        <v-col cols="4" lg="1" md="2" sm="2" class="ml-auto">
          <LanguageSelect no-text show-shadow background-color="#FFFFFF" />
        </v-col>
      </v-row>
      <div class="pg-grid pg-grid-cols-1 md:pg-grid-cols-2 pg-gap-5">
        <SectionImageLAP
          :section="section.library"
          :small="$vuetify.breakpoint.mdAndDown"
          @click:play="handleAudioPlay"
          @click="handleClick"
        />

        <SectionImageLAP
          :section="section.wellbeing"
          :small="$vuetify.breakpoint.mdAndDown"
          @click:play="handleAudioPlay"
          @click="handleClick"
        />
      </div>

      <div
        class="pg-grid pg-grid-cols-1 md:pg-grid-cols-5 pg-gap-5 pg-mt-10"
      >
        <SectionImageLAP
          small
          :section="section.cubby"
          @click:play="handleAudioPlay"
          @click="handleClick"
        />

        <SectionImageLAP
          small
          :section="section.music"
          @click:play="handleAudioPlay"
          @click="handleClick"
        />

        <SectionImageLAP
          small
          :section="section.kidscorner"
          @click:play="handleAudioPlay"
          @click="handleClick"
        />

        <SectionImageLAP
          small
          mini-blocked
          :section="section.dashboard"
          @click:play="handleAudioPlay"
          @click="showIntroDialog = true"
        />

        <SectionImageLAP
          :section="section.classes"
          small
          :blocked="!hasPlayAndLearnPlanLivePlan"
          @click:play="handleAudioPlay"
          @click="handleClick"
        />
      </div>
    </div>

    <DailyLessonsDialog v-model="showIntroDialog" />
    <BirthdayVideoDialog />
  </v-main>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  ref,
  useRouter,
  useStore
} from '@nuxtjs/composition-api'

import { useAuth, useLanguageHelper } from '@/composables'
import { TypedStore, Child } from '@/models'
import { useChildren } from '@/composables/store/use-children.composable'
import BirthdayVideoDialog from '@/components/features/childBirthday/BirthdayVideoDialog.vue'
import SectionImageLAP from '@/components/app/virtual-preschool/SectionImageLAP.vue'
import { useLessonApi } from '@/composables/lesson'
import SectionImage from '@/components/app/virtual-preschool/SectionImage.vue'
import LanguageSelect from '@/components/app/user/LanguageSelect.vue'
import DailyLessonsDialog from './DailyLessonsDialog.vue'

export default defineComponent({
  name: 'VirtualLearnAndPlay',

  components: {
    BirthdayVideoDialog,
    SectionImageLAP,
    DailyLessonsDialog,
    SectionImage,
    LanguageSelect
  },

  setup() {
    const language = useLanguageHelper()
    const store = useStore<TypedStore>()
    const currentLessonId = ref<number | undefined>(undefined)
    const router = useRouter()
    const { accessToken } = useAuth({ store })
    const children = useChildren({ store })
    const baseRoute =
      process.env.testEnv === 'production' ? process.env.baseRouteProd : '/'

    const currentChild = computed(
      (): Utils.Maybe<Child> => store.getters.getCurrentChild?.[0]
    )

    const lessonApi = useLessonApi({ child: children.currentChild })
    const showIntroDialog = ref(false)

    const goToKidsCorner = () => {
      const kidsCornerUrl = process.env.kidsCornerUrl
      window.open(`${kidsCornerUrl}?atoken=${accessToken.value}`, '_blank')
    }

    const section = {
      dashboard: {
        imageUrl: require('@/assets/png/virtual-preschool/sections-images/dayli_lessons.png'),
        teacherUrl: require('@/assets/png/virtual-preschool/teacher/Miss_Beth-daily lessons.png'),
        title: language.t('virtualPreschool.sections.dashboard.title'),
        route: { name: 'app-dashboard' },
        message: language.t('virtualPreschool.sections.dashboard.message'),
        audio: `${baseRoute}audio/virtual-preschool/Daily lessons.m4a`,
        color: '#359846',
        textColor: '#C9EE9D',
        bubbleText: '#359846'
      },
      kidscorner: {
        imageUrl: require('@/assets/png/virtual-preschool/sections-images/kids_corner.png'),
        teacherUrl: require('@/assets/png/virtual-preschool/teacher/Miss_Katryna-kidscorner.png'),
        title: language.t('virtualPreschool.sections.kidscorner.title'),
        route: goToKidsCorner,
        message:
          language.t('virtualPreschool.sections.kidscorner.message'),
        audio: `${baseRoute}audio/virtual-preschool/Kidscorner.m4a`,
        color: '#FCF394',
        textColor: '#AF7E00',
        bubbleText: '#AF7E00'
      },
      classes: {
        imageUrl: require('@/assets/png/virtual-preschool/sections-images/live_classes.png'),
        teacherUrl: require('@/assets/png/virtual-preschool/teacher/Miss_Lucy-Liveclasses.png'),
        title: language.t('virtualPreschool.sections.classes.title'),
        route: { name: 'app-live-classes' },
        message: language.t('virtualPreschool.sections.classes.message'),
        audio: `${baseRoute}audio/virtual-preschool/Live classes.m4a`,
        color: '#F58E00',
        textColor: '#FEEAA5',
        bubbleText: '#F58E00'
      },
      cubby: {
        imageUrl: require('@/assets/png/virtual-preschool/sections-images/student_cubby.png'),
        teacherUrl: require('@/assets/png/virtual-preschool/teacher/Miss_Ally_cubby.png'),
        title: language.t('virtualPreschool.sections.cubby.title'),
        route: {
          name: 'app-student-cubby-puzzle',
          query: { id: currentChild.value?.id }
        },
        message: language.t('virtualPreschool.sections.cubby.message'),
        audio: `${baseRoute}audio/virtual-preschool/Cubby.m4a`,
        color: '#FFC648',
        textColor: '#FF8000',
        bubbleText: '#FF8000'
      },
      music: {
        imageUrl: require('@/assets/png/virtual-preschool/sections-images/music.png'),
        teacherUrl: require('@/assets/png/virtual-preschool/teacher/Miss_Emma_Music.png'),
        title: language.t('virtualPreschool.sections.music.title'),
        route: { name: 'app-music' },
        message: language.t('virtualPreschool.sections.music.message'),
        audio: `${baseRoute}audio/virtual-preschool/Music.m4a`,
        color: '#F6B7D2',
        textColor: '#CF2A5C',
        bubbleText: '#CF2A5C'
      },
      library: {
        imageUrl: require('@/assets/png/virtual-preschool/sections-images/video_library.png'),
        teacherUrl: require('@/assets/png/virtual-preschool/teacher/Miss_Raulbel-Library.png'),
        title: language.t('virtualPreschool.sections.library.title'),
        route: { name: 'app-library' },
        message: language.t('virtualPreschool.sections.library.message'),
        audio: `${baseRoute}audio/virtual-preschool/Library.m4a`,
        color: '#BFBFF7',
        textColor: '#8659C6',
        bubbleText: '#8659C6'
      },
      wellbeing: {
        imageUrl: require('@/assets/png/virtual-preschool/sections-images/social_emotional.png'),
        teacherUrl: require('@/assets/png/virtual-preschool/teacher/teacher_well_being.png'),
        title: language.t('virtualPreschool.sections.wellbeing.title'),
        route: { name: 'app-learn-play' },
        message:
          language.t('virtualPreschool.sections.wellbeing.message'),
        audio: `${baseRoute}audio/virtual-preschool/Social and emotional.m4a`,
        color: '#B2E68D',
        textColor: '#1A8901',
        bubbleText: '#1A8901'
      }
    }

    type Section = typeof section
    type SectionItem = Section[keyof Section]

    const player = ref<HTMLAudioElement>()
    const isBirthdayModalvisible = ref(false)

    onMounted(async () => {
      player.value = new Audio()
      const data = await lessonApi.getChildsCurrentLesson()
      if (data) {
        const { lesson } = data
        currentLessonId.value = lesson.curriculumType.id
      }
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

    const hasPlayAndLearnPlanLivePlan = computed(
      () => store.getters['auth/hasPlayAndLearnLivePlan']
    )

    return {
      section,
      isBirthdayModalvisible,
      showIntroDialog,
      goToKidsCorner,
      handleClick,
      handleAudioPlay,
      hasPlayAndLearnPlanLivePlan
    }
  }
})
</script>
