<template>
  <v-main>
    <v-row align-content="center" justify="center" no-gutters class="virtual-preschool">
      <v-col v-for="section in sections" :key="section.title" cols="12" md="4">
        <v-img
          :src="section.imageUrl"
          gradient="rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15)"
          class="section"
          contain
          tile
        >
          <div class="section-content">
            <!-- Start Playing Button -->
            <img
              class="section-start-playing"
              src="@/assets/png/virtual-preschool/Start Playing.png"
              @click="$router.push({ name: section.routeName })"
            >

            <!-- Lady -->
            <img class="section-lady" src="@/assets/png/virtual-preschool/LadyA.png">

            <!-- Bubble -->
            <img class="section-bubble" src="@/assets/png/virtual-preschool/Bubble.png">

            <!-- Bubble Text -->
            <div class="section-bubble-text">
              {{ section.message }}
              <v-icon class="white--text" size="20" @click.stop="handleAudioPlay(section.audio)">
                mdi-volume-high
              </v-icon>
            </div>
          </div>

          <!-- Section Button -->
          <div class="section-btn">
            <div>{{ section.title }}</div>
          </div>
        </v-img>
      </v-col>
    </v-row>
  </v-main>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { onMounted, ref } from '@vue/composition-api'

export default defineComponent({
  layout: 'pg',

  setup () {
    const sections = [
      {
        imageUrl: require('@/assets/png/virtual-preschool/Daily lessons.png'),
        title: 'Daily Lessons',
        routeName: 'app-dashboard',
        message: 'We can’t wait to learn with you every day!',
        audio: '/audio/virtual-preschool/Daily lessons.m4a'
      },
      {
        imageUrl: require('@/assets/png/virtual-preschool/playdates.png'),
        title: 'Playdates',
        routeName: 'app-playdates',
        message: 'Join our teacher-led playdates for fun with friends!',
        audio: '/audio/virtual-preschool/Playdates.m4a'
      },
      {
        imageUrl: require('@/assets/png/virtual-preschool/live classes.png'),
        title: 'Live Classes',
        routeName: 'app-live-classes',
        message: 'Enjoy cooking, music, movement zooms and more!',
        audio: '/audio/virtual-preschool/Live classes.m4a'
      },
      {
        imageUrl: require('@/assets/png/virtual-preschool/Cubby.png'),
        title: 'Student Cubby',
        routeName: 'app-student-cubby',
        message: 'Store your work and track progress in your cubby!',
        audio: '/audio/virtual-preschool/Cubby.m4a'
      },
      {
        imageUrl: require('@/assets/png/virtual-preschool/Music.png'),
        title: 'Music',
        routeName: 'app-music',
        message: 'Listen anytime to sing and learn!',
        audio: '/audio/virtual-preschool/Music.m4a'
      },
      {
        imageUrl: require('@/assets/png/virtual-preschool/Library.png'),
        title: 'Library',
        routeName: 'app-library',
        message: 'Come read with us in the book nook!',
        audio: '/audio/virtual-preschool/Library.m4a'
      }
    ]

    const player = ref<HTMLAudioElement>()

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
      handleAudioPlay
    }
  }
})
</script>

<style lang="scss" scoped>
.virtual-preschool {
  max-width: 1300px;
  margin: auto;
}

.section {
  &-content {
    transition: 0.2s;
    width: 100%;
    height: 100%;
    opacity: 0;

    &:hover {
      opacity: 1;
    }
  }

  &-bubble-text {
    color: white;
    font-weight: bold;
    text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

    height: 100px;
    width: 55%;
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
    height: 55%;
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
    border: 4px solid #B2E68D;
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

  @media (max-width: $breakpoint-sm) {
    .section {
      &-content {
        opacity: 1;
      }
    }
  }
}
</style>
