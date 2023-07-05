<template>
  <v-main>
    <div class="pg-w-[90%] pg-mx-auto pg-my-5">
      <div class="pg-grid pg-grid-cols-1 md:pg-grid-cols-2 pg-gap-5">
        <section-image
          :section="section.dashboard"
          :small="$vuetify.breakpoint.mdAndDown"
          @click:play="handleAudioPlay"
          @click="handleClick"
        />

        <section-image
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

import BirthdayVideoDialog from '@/components/features/childBirthday/BirthdayVideoDialog.vue'
import SectionImage from '@/components/app/virtual-preschool/SectionImage.vue'

export default defineComponent({
  name: 'VirtualPreschoolChild',

  components: {
    BirthdayVideoDialog,
    SectionImage
  },

  setup() {
    const store = useStore<TypedStore>()
    const router = useRouter()
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
    const section = {
      dashboard: {
        imageUrl: require('@/assets/png/virtual-preschool/sections-images/dayli_lessons.png'),
        teacherUrl: require('@/assets/png/virtual-preschool/teacher/Miss_Beth-daily lessons.png'),
        title: `${lang.t('virtualPreschool.sections.dashboard.title')}`,
        message: `${lang.t('virtualPreschool.sections.dashboard.message')}`,
        route: { name: 'app-dashboard' },
        audio: `${baseRoute}audio/virtual-preschool/Daily lessons.m4a`,
        color: '#359846',
        textColor: '#C9EE9D',
        bubbleText: '#359846'
      },
      kidscorner: {
        imageUrl: require('@/assets/png/virtual-preschool/sections-images/kids_corner.png'),
        teacherUrl: require('@/assets/png/virtual-preschool/teacher/Miss_Katryna-kidscorner.png'),
        title: `${lang.t('virtualPreschool.sections.kidscorner.title')}`,
        message:
          `${lang.t('virtualPreschool.sections.kidscorner.message')}`,
        route: goToKidsCorner,
        audio: `${baseRoute}audio/virtual-preschool/Kidscorner.m4a`,
        color: '#FCF394',
        textColor: '#AF7E00',
        bubbleText: '#AF7E00'
      },
      classes: {
        imageUrl: require('@/assets/png/virtual-preschool/sections-images/live_classes.png'),
        teacherUrl: require('@/assets/png/virtual-preschool/teacher/Miss_Lucy-Liveclasses.png'),
        title: `${lang.t('virtualPreschool.sections.classes.title')}`,
        message:
          `${lang.t('virtualPreschool.sections.classes.message')}`,
        route: { name: 'app-live-classes' },
        audio: `${baseRoute}audio/virtual-preschool/Live classes 2.m4a`,
        color: '#F58E00',
        textColor: '#FEEAA5',
        bubbleText: '#F58E00'
      },
      cubby: {
        imageUrl: require('@/assets/png/virtual-preschool/sections-images/student_cubby.png'),
        teacherUrl: require('@/assets/png/virtual-preschool/teacher/Miss_Ally_cubby.png'),
        title: `${lang.t('virtualPreschool.sections.cubby.title')}`,
        message:
          `${lang.t('virtualPreschool.sections.cubby.message')}`,
        route: {
          name: 'app-student-cubby-puzzle',
          query: { id: currentChild.value?.id }
        },
        audio: `${baseRoute}audio/virtual-preschool/Cubby.m4a`,
        color: '#FFC648',
        textColor: '#FF8000',
        bubbleText: '#FF8000'
      },
      music: {
        imageUrl: require('@/assets/png/virtual-preschool/sections-images/music.png'),
        teacherUrl: require('@/assets/png/virtual-preschool/teacher/Miss_Emma_Music.png'),
        title: `${lang.t('virtualPreschool.sections.music.title')}`,
        message:
          `${lang.t('virtualPreschool.sections.music.message')}`,
        route: { name: 'app-music' },
        audio: `${baseRoute}audio/virtual-preschool/Music.m4a`,
        color: '#F6B7D2',
        textColor: '#CF2A5C',
        bubbleText: '#CF2A5C'
      },
      library: {
        imageUrl: require('@/assets/png/virtual-preschool/sections-images/video_library.png'),
        teacherUrl: require('@/assets/png/virtual-preschool/teacher/Miss_Raulbel-Library.png'),
        title: `${lang.t('virtualPreschool.sections.library.title')}`,
        message:
          `${lang.t('virtualPreschool.sections.library.message')}`,
        route: { name: 'app-library' },
        audio: `${baseRoute}audio/virtual-preschool/Library.m4a`,
        color: '#BFBFF7',
        textColor: '#8659C6',
        bubbleText: '#8659C6'
      },
      wellbeing: {
        imageUrl: require('@/assets/png/virtual-preschool/sections-images/social_emotional.png'),
        teacherUrl: require('@/assets/png/virtual-preschool/teacher/teacher_well_being.png'),
        title: `${lang.t('virtualPreschool.sections.wellbeing.title')}`,
        message:
          `${lang.t('virtualPreschool.sections.wellbeing.message')}`,
        route: { name: 'app-learn-play' },
        audio: '',
        color: '#B2E68D',
        textColor: '#1A8901',
        bubbleText: '#1A8901'
      }
    }

    type Section = typeof section
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

    return {
      section,
      goToKidsCorner,
      handleAudioPlay,
      handleClick,
      isBirthdayModalVisible
    }
  }
})
</script>
