<template>
  <v-container class="featured-video" fluid :style="{ '--featuredVideoThumbnail': thumbnail }">
    <v-row class="featured-video-row" align="center" justify="end">
      <img
        class="featured-video-play"
        src="@/assets/svg/play-button-icon.svg"
        @click="$emit('play')"
      >

      <div class="featured-video-vow">
        Video of the week:
      </div>

      <img
        class="featured-video-activity-type hidden-md-and-up"
        :src="activityType"
      >

      <div class="featured-video-title">
        <img
          class="featured-video-activity-type hidden-sm-and-down"
          :src="activityType"
        >
        {{ title }}
      </div>

      <div class="featured-video-teacher">
        With {{ teacher }}
      </div>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'FeaturedVideo',

  props: {
    video: {
      type: Object,
      required: true
    }
  },

  computed: {
    title () {
      return this.video.videos.description
    },

    teacher () {
      return this.video.videos.name
    },

    thumbnail () {
      const thumbnail = this.video.videos.thumbnail
      return `linear-gradient(to top, #4D4D4D 0%, rgba(77, 77, 77, 0) 49.52%), url("${thumbnail}")`
    },

    activityType () {
      return this.video.activityType.icon
    }
  }
}
</script>

<style lang="scss">
.featured-video {
  // Container style
  display: flex;
  position: relative;
  min-height: calc(100vh - 64px);
  margin-top: -12px;
  margin-bottom: 12px;
  padding-bottom: 24px;
  background-image: var(--featuredVideoThumbnail);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  z-index: 5;
  @media screen and (min-width: 960px) {
    border-radius: 0 0 3% 3% / 0 0 6% 6%;
    padding-bottom: 36px;
  }

  // Container row
  &-row.row {
    flex-direction: column !important;
    @media screen and (max-width: 599px) and (orientation: portrait) {
      justify-content: center !important;
    }
  }

  // Video play icon style
  &-play {
    width: 96px;
    height: 96px;
    margin: 12px;
    cursor: pointer;
    transition: transform 0.25s ease-in-out;
    @media screen and (min-height: 375px) {
      margin-bottom: 24px;
    }
    @media screen and (min-width: 600px) {
      margin-bottom: 32px;
    }
    @media screen and (min-width: 960px) {
      width: 128px;
      height: 128px;
    }
    @media screen and (min-width: 1904px) {
      width: 196px;
      height: 196px;
      margin-bottom: 48px;
    }
    &:hover {
      transform: scale(1.25);
    }
  }

  // Video of the week style
  &-vow {
    font-size: 30px;
    font-weight: 700;
    line-height: 1.15;
    text-align: center;
    color: white;
    @media screen and (min-height: 375px) {
      line-height: 1.5;
    }
    @media screen and (min-width: 960px) {
      font-size: 60px;
    }
  }

  // Video play icon style
  &-activity-type {
    width: 48px;
    height: 48px;
    margin: 0px;
    object-fit: contain;
    object-position: center;
    @media screen and (min-height: 375px) {
      margin: 6px;
    }
    @media screen and (min-width: 600px) {
      width: 64px;
      height: 64px;
      margin: 12px;
    }
    @media screen and (min-width: 960px) {
      width: 96px;
      height: 96px;
      vertical-align: middle;
    }
  }

  // Video title style
  &-title {
    width: 100%;
    font-size: 28px;
    font-weight: 600;
    line-height: 1.15;
    text-align: center;
    color: white;
    @media screen and (min-height: 375px) {
      line-height: 1.5;
    }
    @media screen and (min-width: 960px) {
      font-size: 60px;
    }
  }

  // Video teacher style
  &-teacher {
    font-size: 20px;
    font-weight: 600;
    line-height: 1.25;
    text-align: center;
    color: white;
    @media screen and (min-height: 375px) {
      line-height: 1.5;
    }
    @media screen and (min-width: 960px) {
      margin-top: -20px;
      font-size: 30px;
    }
  }
}
</style>
