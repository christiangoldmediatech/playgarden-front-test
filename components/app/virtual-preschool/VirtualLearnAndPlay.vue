<template>
  <v-main>
    <div :class="$vuetify.breakpoint.mdAndDown ? 'mobile' : 'desktop'">
      <SectionImageLAP
        class="learn-and-play"
        :section="section.playandlearn"
        @click="handleClick"
      />

      <section-image
        class="well-being"
        :section="section.wellbeing"
        @click:play="handleAudioPlay"
        @click="handleClick"
      />

      <SectionImageLAP
        class="live-classes"
        :section="section.classes"
        blocked
        @click="handleClick"
      />

      <SectionImageLAP
        class="kids-corner"
        :section="section.kidscorner"
        @click="handleClick"
      />

      <SectionImageLAP
        class="student-cubby"
        :section="section.cubby"
        @click="handleClick"
      />

      <DailyLessonsDialog v-model="showIntroDialog" />

      <SectionImageLAP
        class="daily-lessons"
        :section="section.dashboard"
        @click="showIntroDialog = true"
      />

      <SectionImageLAP
        class="music"
        :section="section.music"
        small
        @click="handleClick"
      />

      <SectionImageLAP
        class="playdates"
        :section="section.playdates"
        blocked
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
import { useChildren } from '@/composables/store/use-children.composable'
import BirthdayVideoDialog from '@/components/features/childBirthday/BirthdayVideoDialog.vue'
import SectionImageLAP from '@/components/app/virtual-preschool/SectionImageLAP.vue'
import { useLessonApi } from '@/composables/lesson'
import SectionImage from '@/components/app/virtual-preschool/SectionImage.vue'
import DailyLessonsDialog from './DailyLessonsDialog.vue'

export default defineComponent({
  name: 'VirtualLearnAndPlay',

  components: {
    BirthdayVideoDialog,
    SectionImageLAP,
    DailyLessonsDialog,
    SectionImage
  },

  setup() {
    const store = useStore<TypedStore>()
    const currentLessonId = ref<number | undefined>(undefined)
    const router = useRouter()
    const { accessToken } = useAuth({ store })
    const children = useChildren({ store })

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
        imageUrl: require('@/assets/png/virtual-preschool/playdates.png'),
        title: 'Daily Lessons',
        route: { name: 'app-dashboard' },
        audio: ''
      },
      kidscorner: {
        imageUrl: require('@/assets/png/virtual-preschool/kidscorner.png'),
        title: 'Kids Corner',
        route: goToKidsCorner,
        audio: ''
      },
      playdates: {
        imageUrl: require('@/assets/png/virtual-preschool/Daily lessons.png'),
        title: 'Playdates',
        route: { name: 'app-playdates' },
        audio: ''
      },
      classes: {
        imageUrl: require('@/assets/png/virtual-preschool/live classes.png'),
        title: 'Live Classes',
        route: { name: 'app-live-classes' },
        audio: ''
      },
      cubby: {
        imageUrl: require('@/assets/png/virtual-preschool/Cubby.png'),
        title: 'Student Cubby',
        route: {
          name: 'app-student-cubby-puzzle',
          query: { id: currentChild.value?.id }
        },
        audio: ''
      },
      music: {
        imageUrl: require('@/assets/jpg/virtual-preschool/Music.JPG'),
        title: 'Music',
        route: { name: 'app-music' },
        audio: ''
      },
      wellbeing: {
        imageUrl: require('@/assets/jpg/virtual-preschool/well-being.jpg'),
        title: 'Well-being',
        route: { name: 'app-learn-play' },
        message: 'Have fun together with activities, games, books and so much more',
        audio: ''
      },
      playandlearn: {
        imageUrl: require('@/assets/png/virtual-preschool/learnandplay.png'),
        title: 'Watch and Learn',
        route: { name: 'app-library' },
        audio: ''
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

    return {
      section,
      isBirthdayModalvisible,
      showIntroDialog,
      goToKidsCorner,
      handleClick,
      handleAudioPlay
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
  grid-template-columns: repeat(8, 12%);
  grid-template-rows: repeat(4, 100px) repeat(1, 300px);
  margin: auto;
  width: 90%;
  gap: 1rem;
  margin: 1rem auto;

  .learn-and-play {
    grid-column: 1 / span 3;
    grid-row: 1 / span 4;
  }
  .well-being {
    grid-column: 4 / span 3;
    grid-row: 1 / span 4;
  }
  .daily-lessons {
    grid-column: 3 / 5;
    grid-row: 5 / 5;
  }
  .live-classes {
    grid-column: 5 / 7;
    grid-row: 5 / 5;
  }
  .playdates {
    grid-column: 7 / 9;
    grid-row: 5 / 5;
  }
  .music {
    grid-column: 7 / 9;
    grid-row: 1 / 3;
  }
  .student-cubby {
    grid-column: 1 / 3;
    grid-row: 5 / 5;
  }
  .kids-corner {
    grid-column: 7 / 9;
    grid-row: 3 / 5;
  }
}
</style>
