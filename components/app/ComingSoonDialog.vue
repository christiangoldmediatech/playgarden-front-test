<template>
  <v-dialog
    :value="showing && isBeforeDueDate"
    max-width="1000px"
    persistent
  >
    <v-card color="white" max-width="1100px">
      <div class="green-line green-line-1" />
      <div class="green-line green-line-2" />
      <v-card-text class="pa-0">
        <v-row no-gutters>
          <v-col cols="4" class="hidden-sm-and-down pa-0">
            <v-container class="img-container pa-0 ma-0">
              <img src="@/assets/png/coming-soon.png" class="image" />
              <!-- <v-img cover :src="require('@/assets/png/coming-soon.png')" /> -->
            </v-container>
          </v-col>
          <v-col cols="12" md="8">
            <v-container>
              <div class="text-center text-md-left my-6">
                <underlined-title
                  class="text-h4 text-md-h3"
                  text="Welcome to Playgarden Prep Online!"
                />
              </div>
              <div class="mb-6">
                <h2 class="pl-3 mb-6 font-weight-medium text-title text-center text-md-left">
                  School starts Monday, December 7th!
                </h2>
                <h3 class="pl-3 mb-6 font-weight-medium text-subtitle text-center text-md-left">
                  Count down with us:
                </h3>
              </div>
              <div class="my-6">
                <v-row no-gutters justify="space-between" class="time-left-wrapper">
                  <div class="time-left-background"></div>
                  <v-col>
                    <p class="text-center text-number-title font-weight-bold">
                      {{ timeLeft.days }}
                    </p>
                    <p class="text-center">
                      days
                    </p>
                  </v-col>
                  <v-col>
                    <p class="text-center text-number-title font-weight-bold">
                      {{ timeLeft.hours }}
                    </p>
                    <p class="text-center">
                      hours
                    </p>
                  </v-col>
                  <v-col>
                    <p class="text-center text-number-title font-weight-bold">
                      {{ timeLeft.minutes }}
                    </p>
                    <p class="text-center">
                      minutes
                    </p>
                  </v-col>
                </v-row>
              </div>
              <div class="my-6">
                <h2 class="pl-3 mb-2 mt-6 font-weight-medium text-title text-center text-md-left">
                  Can't wait?
                </h2>
                <h3 class="pl-3 mb-2 mt-6 font-weight-medium text-subtitle text-center text-md-left">
                  Check out a sneak peak!
                </h3>
                <div class="text-center mt-5 text-md-left">
                  <v-btn class="px-13 ml-3" color="accent" @click="showVideos">
                    Video Lessons
                  </v-btn>
                </div>
              </div>
            </v-container>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ComingSoonDialog',

  props: {
    showing: {
      type: Boolean,
      required: true
    }
  },

  data: () => {
    return {
      interval: null,
      isBeforeDueDate: true,
      timeLeft: {
        days: 0,
        hours: 0,
        minutes: 0
      }
    }
  },

  mounted () {
    const countDownDate = new Date('Dec 07, 2020 00:00:00').getTime()

    const getTime = () => {
      // Get today's date and time
      const now = new Date().getTime()

      // Find the distance between now and the count down date
      const distance = countDownDate - now
      if (distance <= 0) {
        this.isBeforeDueDate = false
      }

      // Time calculations for days, hours, minutes and seconds
      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))

      this.timeLeft = {
        days,
        hours,
        minutes
      }

      // If the count down is finished, write some text
      if (distance < 0) {
        clearInterval(this.interval)
      }
    }

    getTime()

    this.interval = window.setInterval(getTime, 60000)
  },

  beforeDestroy () {
    if (this.interval) {
      window.clearInterval(this.interval)
      this.interval = null
    }
  },

  methods: {
    showVideos () {
      this.$nuxt.$emit('open-coming-soon-video-player')
    }
  }
}
</script>

<style lang="scss" scoped>
.text {
  &-number-title {
    font-size: 45px !important;
    line-height: 38px !important;
    color: #C2DAA5;
  }
  &-title {
    font-size: 32px !important;
    line-height: 32px !important;
  }
  &-subtitle {
    font-size: 20px !important;
    line-height: 20px !important;
  }
}
.time-left {
  &-wrapper {
    position: relative;
  }
  &-background {
    position: absolute;
    top: 15px;
    left: 0;
    height: 80%;
    width: 100%;
    background-color: rgba(194, 218, 165, 0.18);
  }
}
.img-container {
  height: 100%;
  width: 100%;
  overflow: hidden;
  .image {
    height: 100%;
    width: 100%;
  }
}
</style>
