<template>
  <div
    class="elevation-3 meeting-card py-4 px-8 v2-font pg-relative"
    :class="{
      'playdate-card': meeting.type === 'Playdate',
      'liveclass-card': meeting.type === 'LiveClass',
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
        <span class="meeting-title">
          {{
            meeting.type === 'LiveClass' ? meeting.activityType.name : meeting.title
          }}
        </span>
        <span v-if="meeting.teacher" class="meeting-subtitle">
          {{
            meeting.teacher.name
          }}
        </span>
        <br />
      </div>
    </div>
    <div class="meeting-description">
      <p>{{ meeting.description }}</p>
    </div>
    <div class="d-flex justify-center">
      <v-btn class="btn-meeting white--text" color="#F89838" @click="goToLiveClasses">
        {{ $t('lessonEnd.meetingCard.button') }}
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, useRouter } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'MeetingCard',

  props: {
    meeting: {
      type: Object,
      required: true
    }
  },

  setup() {
    const router = useRouter()

    const goToLiveClasses = () => {
      router.push({ name: 'app-live-classes' })
    }

    return {
      goToLiveClasses
    }
  }
})
</script>

<style lang="scss" scoped>

.meeting-card {
  width: 500px;
  position: relative;
  transition: transform 250ms;
  overflow: hidden;
  border-radius: 10px;
  border-width: 3px;
  border-style: solid;
  border-color: #f89838;
  background-color: #fff7f0;
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
  font-size: 22px;
  color: #606060;
}

.meeting-subtitle {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  color: #707070;
}

.meeting-description {
  p {
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 28px;
    color: #707070;
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
