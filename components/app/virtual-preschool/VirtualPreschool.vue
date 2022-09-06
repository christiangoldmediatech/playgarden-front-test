<template>
  <v-main>
    <div :class="$vuetify.breakpoint.mdAndDown ? 'mobile' : 'desktop'">
      <section-image
        class="daily-lessons"
        :section="section.dashboard"
        @click:play="handleAudioPlay"
        @click="handleClick"
      />

      <section-image
        class="well-being"
        :section="section.wellbeing"
        @click:play="handleAudioPlay"
        @click="handleClick"
      />

      <section-image
        class="live-classes"
        :section="section.classes"
        @click:play="handleAudioPlay"
        @click="handleClick"
      />

      <section-image
        class="playdates"
        :section="section.playdates"
        @click:play="handleAudioPlay"
        @click="handleClick"
      />

      <section-image
        class="student-cubby"
        :section="section.cubby"
        @click:play="handleAudioPlay"
        @click="handleClick"
      />

      <section-image
        class="kids-corner"
        :section="section.kidscorner"
        @click:play="handleAudioPlay"
        @click="handleClick"
      />

      <section-image
        class="music"
        :section="section.music"
        small
        @click:play="handleAudioPlay"
        @click="handleClick"
      />

      <section-image
        class="library"
        :section="section.library"
        small
        @click:play="handleAudioPlay"
        @click="handleClick"
      />
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

import { useAuth } from '@/composables'
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
      const kidsCornerUrl = process.env.kidsCornerUrl
      window.open(`${kidsCornerUrl}?atoken=${accessToken.value}`, '_self')
    }

    const section = {
      dashboard: {
        imageUrl: require('@/assets/png/virtual-preschool/Daily lessons.png'),
        teacherUrl: require('@/assets/png/virtual-preschool/teacher/Miss_Beth-daily lessons.png'),
        title: 'Daily Lessons',
        route: { name: 'app-dashboard' },
        message: 'We can’t wait to learn with you every day!',
        audio: `${baseRoute}audio/virtual-preschool/Daily lessons.m4a`
      },
      kidscorner: {
        imageUrl: require('@/assets/png/virtual-preschool/kidscorner.png'),
        teacherUrl: require('@/assets/png/virtual-preschool/teacher/Miss_Katryna-kidscorner.png'),
        title: 'Kids Corner',
        route: goToKidsCorner,
        message:
          'It\'s a little bit silly in the Kids Corner, where kids choose how to learn',
        audio: `${baseRoute}audio/virtual-preschool/Kidscorner.m4a`
      },
      playdates: {
        imageUrl: require('@/assets/png/virtual-preschool/playdates.png'),
        teacherUrl: require('@/assets/png/virtual-preschool/teacher/Miss_Shyla_playdates.png'),
        title: 'Playdates',
        route: { name: 'app-playdates' },
        message: 'Join our teacher-led playdates for fun with friends!',
        audio: `${baseRoute}audio/virtual-preschool/Playdates.m4a`
      },
      classes: {
        imageUrl: require('@/assets/png/virtual-preschool/live classes.png'),
        teacherUrl: require('@/assets/png/virtual-preschool/teacher/Miss_Lucy-Liveclasses.png'),
        title: 'Live Classes',
        route: { name: 'app-live-classes' },
        message: 'Enjoy cooking, music, movement zooms and more!',
        audio: `${baseRoute}audio/virtual-preschool/Live classes 2.m4a`
      },
      cubby: {
        imageUrl: require('@/assets/png/virtual-preschool/Cubby.png'),
        teacherUrl: require('@/assets/png/virtual-preschool/teacher/Miss_Ally_cubby.png'),
        title: 'Student Cubby',
        route: {
          name: 'app-student-cubby-puzzle',
          query: { id: currentChild.value?.id }
        },
        message: 'Save your work and track progress in your cubby!',
        audio: `${baseRoute}audio/virtual-preschool/Cubby.m4a`
      },
      music: {
        imageUrl: require('@/assets/jpg/virtual-preschool/Music.JPG'),
        teacherUrl: require('@/assets/png/virtual-preschool/teacher/Miss_Emma_Music.png'),
        title: 'Music',
        route: { name: 'app-music' },
        message: 'Listen anytime to sing and learn!',
        audio: `${baseRoute}audio/virtual-preschool/Music.m4a`
      },
      library: {
        imageUrl: require('@/assets/jpg/virtual-preschool/Library.JPG'),
        teacherUrl: require('@/assets/png/virtual-preschool/teacher/Miss_Raulbel-Library.png'),
        title: 'Video Library',
        route: { name: 'app-library' },
        message: 'Come read with us in the book nook!',
        audio: `${baseRoute}audio/virtual-preschool/Library.m4a`
      },
      wellbeing: {
        imageUrl: require('@/assets/jpg/virtual-preschool/well-being.jpg'),
        teacherUrl: '',
        title: 'Well-being',
        route: { name: 'app-learn-play' },
        message: 'Have fun together with activities, games, books and so much more',
        audio: ''
      }
    }

    type Section = typeof section
    type SectionItem = Section[keyof Section]

    const player = ref<HTMLAudioElement>()
    const isBirthdayModalvisible = ref(false)

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
      isBirthdayModalvisible
    }
  }
})
</script>

<style lang="scss" scoped>
.mobile {
  width: 90%;
  margin: auto;

  & > * {
    margin: 0.75rem 0;
  }
}

.desktop {
  display: grid;
  grid-template-columns: repeat(3, 18.5%) repeat(2, 20%);
  grid-template-rows: repeat(4, 200px);
  margin: auto;
  width: 90%;
  gap: 1rem;
  margin: 1rem auto;

  .daily-lessons {
    grid-column: 1 / span 3;
    grid-row: 1 / span 3;
  }
  .well-being {
    grid-column: 4 / 5;
    grid-row: 3 / 5;
  }
  .live-classes {
    grid-column: 4 / 5;
    grid-row: 1 / 3;
  }
  .playdates {
    grid-column: 5 / 6;
    grid-row: 1 / 3;
  }
  .music {
    grid-column: 1 / 2;
    grid-row: 4 / 5;
  }
  .library {
    grid-column: 2 / 3;
    grid-row: 4 / 5;
  }
  .student-cubby {
    grid-column: 3 / 4;
    grid-row: 4 / 5;
  }
  .kids-corner {
    grid-column: 5 / 6;
    grid-row: 3 / 5;
  }
}
</style>
