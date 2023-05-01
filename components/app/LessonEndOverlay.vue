<template>
  <v-overlay :dark="false" :value="value" z-index="4000">
    <div class="d-flex flex-column align-center !pg-relative">
      <v-btn class="btn-close" icon color="white" x-large @click="$emit('update:value', false)">
        <v-icon>mdi-close</v-icon>
      </v-btn>

      <h1 class="overlay-title mb-2">
        You've completed your first day of video lessons.
      </h1>

      <h2 v-if="upcomingMeeting" class="overlay-subtitle-1 mb-8">
        Join us in our next live class!
      </h2>

      <meeting-card v-if="upcomingMeeting" :meeting="upcomingMeeting" />

      <h3 class="overlay-subtitle-2 my-8">
        For more daily learning, check out our other features:
      </h3>

      <div class="d-flex sections-wrapper">
        <div v-for="section in sections" :key="section.name" class="section clickable" @click="goTo(section.to)">
          <div class="section-img-container d-flex flex-column align-center mb-2">
            <img :src="section.img" />
            <h4 class="section-title py-3">
              {{ section.title }}
            </h4>
          </div>
          <p class="section-description">
            {{ section.description }}
          </p>
        </div>
      </div>
    </div>
  </v-overlay>
</template>

<script lang="ts">
import { useRegisterFlow } from '@/composables/use-register-flow.composable'
import { computed, defineComponent, onMounted, ref, useRouter, useStore } from '@nuxtjs/composition-api'
import MeetingCard from './MeetingCard.vue'

export default defineComponent({
  name: 'LessonEndOverlay',
  components: {
    MeetingCard
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    worksheetUrl: {
      type: Object,
      default: ''
    }
  },
  emits: ['update:value'],
  setup(props) {
    const {
      loadingMeeting,
      upcomingMeeting,
      getUpcomingMeeting
    } = useRegisterFlow()

    const router = useRouter()

    const sections = ref([
      {
        title: 'Worksheet',
        img: require('@/assets/png/worksheet.png'),
        to: props.worksheetUrl,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor '
      },
      {
        title: 'Music',
        img: require('@/assets/jpg/virtual-preschool/Music.JPG'),
        to: 'app-music',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor '
      },
      {
        title: 'Video Library',
        img: require('@/assets/png/virtual-preschool/live classes.png'),
        to: 'app-library',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor '
      }
    ])

    const goTo = (routName: any) => {
      if (typeof routName !== 'string') {
        router.push(routName)
      } else {
        router.push({ name: routName })
      }
    }

    onMounted(async () => {
      await getUpcomingMeeting()
    })

    return {
      loadingMeeting,
      sections,
      upcomingMeeting,
      goTo
    }
  }
})

</script>

<style lang="scss" scoped>
.overlay-title,
.overlay-subtitle-1,
.overlay-subtitle-2 {
  font-family: 'Quicksand';
  font-style: normal;
  font-weight: 700;
  text-align: center;
  margin: 0;
}

.overlay-title {
  font-size: 44px;
  color: #FEC572;
}

.overlay-subtitle-1 {
  font-size: 30px;
  text-align: center;
  color: #DCE7B5;
}

.overlay-subtitle-2 {
  font-size: 34px;
  text-align: center;
  color: #FCF394;
}

.btn-close {
  position: absolute;
  top: -55px;
  right: -55px;
  background: #F6B7D2;
}

.sections-wrapper {
  gap: 4rem;
}

.section {
  width: 220px;
}

.section-img-container {
  width: 100%;
  border-radius: 8px;
  background: white;

  img {
    width: 100%;
    height: 125px;
    object-fit: cover;
    object-position: 0% 5%;
    border-radius: 8px;
  }
}

.section-title {
  font-family: 'Quicksand';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  color: #F89838;
}

.section-description {
  font-family: 'Quicksand';
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  text-align: center;
  color: #FFFFFF;
}
</style>
