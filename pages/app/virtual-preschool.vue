<template>
  <v-main>
    <v-row no-gutters justify="center" class="virtual-preschool">
      <v-col cols="12" md="4" class="section-col-2">
        <section-image
          :section="section.dashboard"
          @click:play="handleAudioPlay"
          @click="handleClick"
        />

        <section-image
          :section="section.kidscorner"
          @click:play="handleAudioPlay"
          @click="handleClick"
        />
      </v-col>

      <v-col cols="12" md="4" class="section-col-3">
        <section-image
          :section="section.playdates"
          @click:play="handleAudioPlay"
          @click="handleClick"
        />

        <section-image
          :section="section.cubby"
          @click:play="handleAudioPlay"
        />

        <section-image
          :section="section.music"
          @click:play="handleAudioPlay"
          @click="handleClick"
        />
      </v-col>

      <v-col cols="12" md="4" class="section-col-2">
        <section-image
          :section="section.classes"
          @click:play="handleAudioPlay"
          @click="handleClick"
        />

        <section-image
          :section="section.library"
          @click:play="handleAudioPlay"
          @click="handleClick"
        />
      </v-col>
    </v-row>
  </v-main>
</template>

<script lang="ts">
import { useAuth } from '@/composables'
import { TypedStore } from '@/models'
import { defineComponent, onMounted, ref, useRouter, useStore } from '@nuxtjs/composition-api'
import SectionImage from '@/components/app/virtual-preschool/SectionImage.vue'

export default defineComponent({
  layout: 'pg',

  components: {
    SectionImage
  },

  setup () {
    const store = useStore<TypedStore>()
    const router = useRouter()
    const { accessToken } = useAuth({ store })
    const baseRoute = process.env.testEnv === 'production' ? `${process.env.baseRouteProd}` : '/'

    const currentChildren = store.getters.getCurrentChild

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
        teacherUrl: require('@/assets/png/virtual-preschool/teacher/Miss_Ally-kidscorner.png'),
        title: 'Kids Corner',
        route: goToKidsCorner,
        message: 'It\'s a little bit silly in the Kids Corner, where kids choose how to learn',
        audio: `${baseRoute}audio/virtual-preschool/Daily lessons.m4a`
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
        route: { name: 'app-student-cubby-puzzle', query: { id: currentChildren[0].id } },
        message: 'Store your work and track progress in your cubby!',
        audio: `${baseRoute}audio/virtual-preschool/Cubby.m4a`
      },
      music: {
        imageUrl: require('@/assets/png/virtual-preschool/Music.png'),
        teacherUrl: require('@/assets/png/virtual-preschool/teacher/Miss_Emma_Music.png'),
        title: 'Music',
        route: { name: 'app-music' },
        message: 'Listen anytime to sing and learn!',
        audio: `${baseRoute}audio/virtual-preschool/Music.m4a`
      },
      library: {
        imageUrl: require('@/assets/png/virtual-preschool/Library.png'),
        teacherUrl: require('@/assets/png/virtual-preschool/teacher/Miss_Raulbel-Library.png'),
        title: 'Library',
        route: { name: 'app-library' },
        message: 'Come read with us in the book nook!',
        audio: `${baseRoute}audio/virtual-preschool/Library.m4a`
      }
    }

    type Section = typeof section
    type SectionItem = Section[keyof Section]

    const player = ref<HTMLAudioElement>()

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
        router.push(route)
      }
    }

    return {
      section,
      goToKidsCorner,
      handleAudioPlay,
      handleClick
    }
  }
})
</script>

<style lang="scss" scoped>
.virtual-preschool {
  max-width: 1500px;
  margin-left: auto;
  margin-right: auto;
  height: 100%;
  max-height: 800px;
}

.section-col-2 {
  height: 100%;
}

.section-col-2 > .section-image {
  height: 50%;
}

.section-col-3 {
  height: 100%;
}

.section-col-3 > .section-image {
  height: 33.33%;
}

@media (max-width: $breakpoint-sm) {
  .virtual-preschool {
    max-width: 1500px;
    margin-left: auto;
    margin-right: auto;
    height: initial;
    max-height: inherit;
  }

  .section-col-2 {
    height: auto;
  }

  .section-col-2 > .section-image {
    height: auto;
  }

  .section-col-3 {
    height: auto;
  }

  .section-col-3 > .section-image {
    height: auto;
  }
}
</style>
