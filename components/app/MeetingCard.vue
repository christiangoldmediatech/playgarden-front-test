<template>
  <div
    class="pg-relative"
    :class="{
      'pt-6': showTime,
      'meeting-card-large': !small,
      'meeting-card-small': small
    }"
  >
    <div v-if="showTime" class="pg-text-right mb-1">
      {{ time }}
    </div>
    <div
      class="elevation-3 meeting-card v2-font"
      :class="{
        'playdate-card': meeting.type === 'Playdate',
        'liveclass-card': meeting.type === 'LiveClass',
        'py-4': !small,
        'py-2': small,
        'px-8': !small,
        'px-4': small,
      }"
    >
      <div class="meeting-card-icon">
        <img
          :src="
            meeting.type === 'LiveClass'
              ? require('@/assets/svg/sessions-liveclass-camera.svg')
              : require('@/assets/svg/sessions-playdate-camera.svg')
          "
        />
      </div>
      <div class="pg-flex pg-items-center pg-gap-2 pg-mt-3">
        <div v-if="meeting.teacher" class="pg-relative">
          <img
            class="meeting-card-type pg-object-cover"
            :src="meeting.teacher.img"
          />
          <div
            v-if="meeting.type !== 'Playdate'"
            class="pg-w-[30px] pg-h-[30px] pg-bg-white pg-rounded-full pg-p-0 pg-shadow-sm pg-absolute pg-bottom-0 pg-right-[-5px] pg-flex pg-items-center pg-justify-center"
          >
            <img
              class="pg-w-[20px] pg-h-[20px] pg-object-contain"
              :src="meeting.activityType.icon"
            />
          </div>
        </div>
        <div v-else>
          <img
            class="meeting-card-type"
            :src="meeting.activityType.icon"
          />
        </div>
        <div class="d-flex flex-column">
          <span class="meeting-title" :class="{ 'meeting-title-large': !small }">
            {{
              meeting.type === 'LiveClass' ? meeting.activityType.name : meeting.title
            }}
          </span>
          <span v-if="meeting.teacher" class="meeting-subtitle" :class="{ 'meeting-title-subtitle': !small }">
            {{
              meeting.teacher.name
            }}
          </span>
          <br />
        </div>
      </div>
      <div class="meeting-description" :class="{ 'meeting-title-description': !small }">
        <p>{{ meeting.description }}</p>
      </div>
      <div v-if="!small" class="d-flex justify-center">
        <v-btn class="btn-meeting white--text" color="#F89838" @click="goToLiveClasses">
          {{ $t('lessonEnd.meetingCard.button') }}
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, useRoute, useRouter, useStore } from '@nuxtjs/composition-api'
import { sameDay, isTomorrow } from '@/utils/dateTools.js'
import { useLanguageHelper } from '@/composables'
import moment from 'moment'
import { formatTimezone } from '@/utils/dateTools'
import dayjs from 'dayjs'

export default defineComponent({
  name: 'MeetingCard',

  props: {
    meeting: {
      type: Object,
      required: true
    },
    small: {
      type: Boolean,
      default: false
    },
    showTime: {
      type: Boolean,
      default: false
    }
  },

  setup(props) {
    const language = useLanguageHelper()
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const userInfo = computed(() => store.getters['auth/getUserInfo'])
    const days = (userInfo.value.language.language === 'Spanish')
      ? [
          'Domingo',
          'Lunes',
          'Martes',
          'Miércoles',
          'Jueves',
          'Viernes',
          'Sábado'
        ]
      : [
          'Sunday',
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday'
        ]

    const goToLiveClasses = () => {
      router.push({ name: 'app-live-classes' })
    }

    const getToday = () => {
      if (route.value.query.tutorial) {
        return dayjs().startOf('week').add(1, 'day').add(10, 'hours').toDate()
      }
      return new Date()
    }

    const time = computed(() => {
      const today = getToday()
      const date = new Date(props.meeting.dateStart)
      let word = days[date.getDay()]
      if (date.getFullYear() === today.getFullYear()) {
        if (sameDay(today, date)) {
          word = language.t('lessonEnd.meetingCard.today')
        } else if (isTomorrow(date)) {
          word = language.t('lessonEnd.meetingCard.tomorrow')
        }
      }

      const start = moment(props.meeting.dateStart)
      const { timezone } = userInfo.value
      return `${word} ${formatTimezone(start, {
        format: 'hh:mma',
        timezone,
        returnObject: false
      })}`
    })

    return {
      time,
      goToLiveClasses
    }
  }
})
</script>

<style lang="scss" scoped>

.meeting-card {
  position: relative;
  transition: transform 250ms;
  overflow: hidden;
  border-radius: 10px;
  border-width: 3px;
  border-style: solid;
  border-color: #f89838;
  background-color: #fff7f0;
}

.meeting-card-large {
  width: 500px;
}

.meeting-card-small {
  width: calc(100% - 24px);
}

.liveclass-card {
  border-color: #f89838;
  background-color: #fff7f0;
}

.playdate-card {
  border-color: #68c453;
  background-color: #f8ffee;
}

.meeting-card-icon {
  position: absolute;
  top: 2px;
  right: 2px;
  display: flex;
  align-items: center;
  gap: 2px;

  img {
    width: 55px;
    height: 55px;
  }
}

.meeting-card-type {
  width: 70px;
  height: 70px;
  border-radius: 8px;
  object-fit: contain;
  object-position: center center;
}

.meeting-title {
  font-family: 'Quicksand';
  font-style: normal;
  font-weight: 700;
  color: #606060;
}

.meeting-title-large {
  font-size: 22px;
}

.meeting-subtitle {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 500;
  color: #707070;
}

.meeting-subtitle-large {
  font-size: 18px;
}

.meeting-description {
  p {
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 400;
    line-height: 28px;
    color: #707070;
  }
}

.meeting-description-large {
  p {
    font-size: 16px;
  }
}

.btn-meeting {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 36px;
  letter-spacing: 0.96px;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.160784) !important;
}
</style>
