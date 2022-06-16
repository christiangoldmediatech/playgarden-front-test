<template>
  <v-main>
    <div :class="$vuetify.breakpoint.mdAndDown ? 'mobile' : 'desktop'">
      <SectionImageLAP
        class="learn-and-play"
        :section="section.playandlearn"
        @click="handleClick"
      />

      <SectionImageLAP
        class="live-classes"
        :section="section.classes"
        @click="handleClick"
      />

      <SectionImageLAP
        class="library"
        :section="section.library"
        height="60%"
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

      <SectionImageLAP
        class="music"
        :section="section.music"
        small
        blocked
        @click="handleClick"
      />

      <SectionImageLAP
        class="daily-lessons"
        :section="section.dashboard"
        blocked
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

import BirthdayVideoDialog from '@/components/features/childBirthday/BirthdayVideoDialog.vue'
import SectionImageLAP from '@/components/app/virtual-preschool/SectionImageLAP.vue'

export default defineComponent({
  name: 'VirtualLearnAndPlay',

  components: {
    BirthdayVideoDialog,
    SectionImageLAP
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
        title: 'Daily Lessons',
        route: { name: 'app-dashboard' }
      },
      kidscorner: {
        imageUrl: require('@/assets/png/virtual-preschool/kidscorner.png'),
        title: 'Kids Corner',
        route: goToKidsCorner
      },
      playdates: {
        imageUrl: require('@/assets/png/virtual-preschool/playdates.png'),
        title: 'Playdates',
        route: { name: 'app-playdates' }
      },
      classes: {
        imageUrl: require('@/assets/png/virtual-preschool/live classes.png'),
        title: 'Live Classes',
        route: { name: 'app-live-classes' }
      },
      cubby: {
        imageUrl: require('@/assets/png/virtual-preschool/Cubby.png'),
        title: 'Student Cubby',
        route: {
          name: 'app-student-cubby-puzzle',
          query: { id: currentChild.value?.id }
        }
      },
      music: {
        imageUrl: require('@/assets/png/virtual-preschool/Music.png'),
        title: 'Music',
        route: { name: 'app-music' }
      },
      library: {
        imageUrl: require('@/assets/png/virtual-preschool/Library.png'),
        title: 'Library',
        route: { name: 'app-library' }
      },
      playandlearn: {
        imageUrl: require('@/assets/png/virtual-preschool/learnandplay.png'),
        title: 'Play and Learn',
        route: { name: 'app-learn-play' }
      }
    }

    type Section = typeof section
    type SectionItem = Section[keyof Section]

    const player = ref<HTMLAudioElement>()
    const isBirthdayModalvisible = ref(false)

    onMounted(() => {
      player.value = new Audio()
    })

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
  grid-template-columns: repeat(4, 25%);
  grid-template-rows: repeat(3, 100px) repeat(2, 200px);
  margin: auto;
  width: 90%;
  gap: 1rem;
  margin: 1rem auto;

  .learn-and-play {
    grid-column: 1 / span 2;
    grid-row: 1 / span 4;
  }
  .daily-lessons {
    grid-column: 3 / 4;
    grid-row: 5 / 5;
  }
  .live-classes {
    grid-column: 3 / 4;
    grid-row: 1 / 5;
  }
  .playdates {
    grid-column: 4 / 5;
    grid-row: 5 / 5;
  }
  .music {
    grid-column: 2 / 3;
    grid-row: 5 / 5;
  }
  .library {
    grid-column: 4 / 5;
    grid-row: 1 / 3;
  }
  .student-cubby {
    grid-column: 1 / 2;
    grid-row: 5 / 5;
  }
  .kids-corner {
    grid-column: 4 / 5;
    grid-row: 3 / 5;
  }
}
</style>
