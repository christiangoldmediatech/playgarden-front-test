<template>
  <v-main>
    <v-row
      align-content="center"
      justify="center"
      class="virtual-preschool"
    >
      <v-col
        v-for="section in sections"
        :key="section.title"
        cols="12"
        md="4"
        class="section"
      >
        <v-img
          :src="section.imageUrl"
          gradient="rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15)"
          contain
          tile
          @click="$router.push(section.route)"
        >
          <div class="section-content">
            <!-- Start Playing Button -->
            <img
              class="section-start-playing"
              src="@/assets/png/virtual-preschool/Start Playing.png"
              :data-test-id="`vp-section-${section.title}`"
            >

            <!-- Lady -->
            <img
              class="section-lady"
              :src="section.teacherUrl"
            >

            <!-- Bubble -->
            <img
              class="section-bubble"
              src="@/assets/png/virtual-preschool/Bubble.png"
            >

            <!-- Bubble Text -->
            <div class="section-bubble-text">
              {{ section.message }}
              <v-btn
                icon
                class="my-n4 mx-n2"
              >
                <v-icon
                  class="white--text"
                  size="22"
                  @click.stop="handleAudioPlay(section.audio)"
                >
                  mdi-volume-high
                </v-icon>
              </v-btn>
            </div>
          </div>

          <!-- Section Button -->
          <div class="section-btn">
            <div>{{ section.title }}</div>
          </div>
        </v-img>
      </v-col>
    </v-row>
    <BirthdayVideoDialog />
  </v-main>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  ref,
  useStore
} from '@nuxtjs/composition-api'
import { Child } from '@/models'
import BirthdayVideoDialog from '@/components/features/childBirthday/BirthdayVideoDialog.vue'

export default defineComponent({
  name: 'VirtualPreschoolPage',
  components: {
    BirthdayVideoDialog
  },
  layout: 'pg',
  setup() {
    const store = useStore()
    const baseRoute =
      process.env.testEnv === 'production'
        ? `${process.env.baseRouteProd}`
        : '/'

    const currentChild = computed((): Utils.Maybe<Child> => store.getters.getCurrentChild?.[0])

    const sections = [
      {
        imageUrl: require('@/assets/png/virtual-preschool/Daily lessons.png'),
        teacherUrl: require('@/assets/png/virtual-preschool/teacher/Miss_Beth-daily lessons.png'),
        title: 'Daily Lessons',
        route: { name: 'app-dashboard' },
        message: 'We can’t wait to learn with you every day!',
        audio: `${baseRoute}audio/virtual-preschool/Daily lessons.m4a`
      },
      {
        imageUrl: require('@/assets/png/virtual-preschool/playdates.png'),
        teacherUrl: require('@/assets/png/virtual-preschool/teacher/Miss_Shyla_playdates.png'),
        title: 'Playdates',
        route: { name: 'app-playdates' },
        message: 'Join our teacher-led playdates for fun with friends!',
        audio: `${baseRoute}audio/virtual-preschool/Playdates.m4a`
      },
      {
        imageUrl: require('@/assets/png/virtual-preschool/live classes.png'),
        teacherUrl: require('@/assets/png/virtual-preschool/teacher/Miss_Lucy-Liveclasses.png'),
        title: 'Live Classes',
        route: { name: 'app-live-classes' },
        message: 'Enjoy cooking, music, movement zooms and more!',
        audio: `${baseRoute}audio/virtual-preschool/Live classes 2.m4a`
      },
      {
        imageUrl: require('@/assets/png/virtual-preschool/Cubby.png'),
        teacherUrl: require('@/assets/png/virtual-preschool/teacher/Miss_Ally_cubby.png'),
        title: 'Student Cubby',
        route: {
          name: 'app-student-cubby-puzzle',
          query: { id: currentChild.value?.id }
        },
        message: 'Store your work and track progress in your cubby!',
        audio: `${baseRoute}audio/virtual-preschool/Cubby.m4a`
      },
      {
        imageUrl: require('@/assets/png/virtual-preschool/Music.png'),
        teacherUrl: require('@/assets/png/virtual-preschool/teacher/Miss_Emma_Music.png'),
        title: 'Music',
        route: { name: 'app-music' },
        message: 'Listen anytime to sing and learn!',
        audio: `${baseRoute}audio/virtual-preschool/Music.m4a`
      },
      {
        imageUrl: require('@/assets/png/virtual-preschool/Library.png'),
        teacherUrl: require('@/assets/png/virtual-preschool/teacher/Miss_Raulbel-Library.png'),
        title: 'Library',
        route: { name: 'app-library' },
        message: 'Come read with us in the book nook!',
        audio: `${baseRoute}audio/virtual-preschool/Library.m4a`
      }
    ]

    const player = ref<HTMLAudioElement>()
    const isBirthdayModalvisible = ref(false)

    onMounted(() => {
      player.value = new Audio()
    })

    const handleAudioPlay = (audio: string) => {
      if (!player.value) {
        return
      }

      player.value.src = audio
      player.value.play()
    }

    return {
      sections,
      handleAudioPlay,
      isBirthdayModalvisible
    }
  }
})
</script>

<style lang="scss" scoped>
.virtual-preschool {
  max-width: 1500px;
  margin: auto;
}

.section {
  padding: 0px;

  &-content {
    transition: 0.2s;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;

    &:hover {
      opacity: 1;
    }
  }

  &-bubble-text {
    color: white;
    font-weight: bold;
    text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

    height: 100px;
    width: 60%;
    position: absolute;
    top: 10%;
    left: 15%;
  }

  &-bubble {
    width: 75%;
    position: absolute;
    top: 15px;
    left: 30px;
  }

  &-lady {
    height: 60%;
    position: absolute;
    right: 0;
    bottom: 0;
  }

  &-start-playing {
    cursor: pointer;
    height: 35%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  &-btn {
    position: absolute;
    bottom: 10px;
    left: 10px;

    background: rgba(178, 230, 141, 0.2);
    border: 4px solid #b2e68d;
    box-sizing: border-box;
    border-radius: 8px;
    cursor: pointer;

    & div {
      color: white;
      font-size: 18px;
      font-weight: bold;
      text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

      padding-top: 4px;
      padding-bottom: 4px;
      padding-left: 12px;
      padding-right: 12px;
    }
  }
}

@media (min-width: $breakpoint-md) {
  .section {
    &-bubble-text {
      font-size: 24px;
    }
  }
}

@media (max-width: $breakpoint-sm) {
  .section {
    padding: 12px;

    &-content {
      opacity: 1;
    }

    &-start-playing {
      visibility: hidden;
    }
  }
}
</style>
