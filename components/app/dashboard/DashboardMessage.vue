<template>
  <v-card class="dashboard-message-container" v-bind="{ ...$attrs }">
    <div class="green-line-bigger green-line-1" />
    <div class="green-line-bigger green-line-2" />

    <div class="dashboard-message-content">
      <v-img
        :src="backgroundImage"
        class="align-end white--text"
        :gradient="gradient"
        max-height="400px"
      >
        <v-row class="mx-0 dashboard-message-padding" justify="center">
          <v-col class="text-center pb-0" cols="12">
            <slot name="title">
              <underlined-title
                class="white--text"
                font-size="56px"
                font-size-mobile="1.5rem"
                font-weight="bold"
                text="Coming Next:"
              />
            </slot>
          </v-col>
          <v-col class="py-0" cols="12" md="8" lg="8" xl="4">
            <slot />
          </v-col>
        </v-row>
        <v-progress-linear
          v-if="timeOut"
          color="accent"
          :size="4"
          :value="progress"
        />
      </v-img>

      <v-row class="flex-column mx-0" align="center">
        <h5 class="my-2 text-h5 font-weight-bold text-center">
          What do you want to do next?
        </h5>

        <v-col
          v-for="(button, i) in buttons"
          :key="`complete-message-${_uid}-button-${i}`"
          class="pb-1"
          cols="12"
          sm="10"
          md="8"
          lg="7"
        >
          <v-btn
            :color="button.color"
            class="dashboard-message-btn white--text"
            :loading="loading"
            block
            x-large
            @click.stop="doAction(button.action)"
          >
            <v-icon v-if="button.iconLeft" class="dashboard-message-btn-icon">
              {{ button.iconLeft }}
            </v-icon>
            {{ button.text }}
            <v-icon v-if="button.iconRight" right>
              {{ button.iconRight }}
            </v-icon>
          </v-btn>
        </v-col>

        <v-col v-if="returnText" cols="12">
          <v-btn
            class="dashboard-message-btn"
            color="primary"
            text
            block
            tile
            :disabled="loading"
            @click.stop="doReturnAction"
          >
            {{ returnText }}
          </v-btn>
        </v-col>
      </v-row>
    </div>
  </v-card>
</template>

<script>
export default {
  name: 'DashboardMessage',

  props: {
    timeOut: {
      type: [Number, Boolean],
      required: false,
      default: 15
    },

    timeOutAction: {
      type: Function,
      required: false,
      default: () => {}
    },

    returnText: {
      type: [String, Boolean],
      required: false,
      default: 'RETURN TO LESSON'
    },

    returnAction: {
      type: Function,
      required: false,
      default: () => {}
    },

    buttons: {
      type: Array,
      required: false,
      default: () => {
        return []
      }
    },

    backgroundImage: {
      type: [Function, Object, String],
      required: false,
      default: require('@/assets/jpg/worksheets_completed_2.jpg')
    }
  },

  data: () => {
    return {
      progress: 0,
      loading: false,
      interval: null
    }
  },

  computed: {
    timeOutMs() {
      return this.timeOut * 1000
    },

    gradient() {
      if (this.$vuetify.breakpoint.xsOnly) {
        return 'to top, rgba(39, 39, 39, 0.9), rgba(255, 255, 255, 0) 120%'
      }
      return 'to top, rgba(39, 39, 39, 0.9), rgba(255, 255, 255, 0) 80%'
    }
  },

  methods: {
    doReturnAction() {
      this.stopInterval()
      this.returnAction()
    },

    startInterval() {
      if (this.timeOut) {
        this.progress = 0
        let end = new Date().getTime()
        end += this.timeOutMs

        this.interval = window.setInterval(async () => {
          const currentTime = new Date().getTime()
          const diff = end - currentTime
          if (diff > 0) {
            const inverted = this.timeOutMs - diff
            this.progress = Math.round((inverted / this.timeOutMs) * 100)
          } else {
            this.stopInterval()
            this.progress = 100
            this.loading = true
            await this.timeOutAction()
            this.loading = false
          }
        }, 25)
      }
    },

    stopInterval() {
      if (this.interval) {
        window.clearInterval(this.interval)
        this.interval = null
      }
    },

    async doAction(action) {
      try {
        this.loading = true
        this.stopInterval()
        await action()
      } catch (error) {
        return Promise.reject(error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss">
.dashboard-message {
  &-container {
    margin: 0 16px;
    max-width: 98vw;
    max-height: 90vh;
    overflow: hidden;
  }
  &-content {
    max-height: calc(90vh - 60px);
    box-shadow: 0 -1px 6px 0 rgba(0, 0, 0, 0.12);
    overflow-x: hidden;
    overflow-y: auto;
  }
  &-padding,
  &-padding.row {
    padding-bottom: 30px;
    @media screen and (max-width: 599px) {
      padding-bottom: 12px;
    }
  }
  &-btn {
    &.v-btn {
      height: 59px !important;
      font-size: 20px;
      letter-spacing: 0.04em;
      font-weight: bold;
      line-height: 1.46;
    }
    &-icon.v-icon {
      font-size: 31px !important;
      line-height: 1 !important;
      position: relative;
      right: 16px;
    }
    @media screen and (max-width: 599px) {
      &.v-btn {
        height: 36px !important;
        font-size: 16px;
        letter-spacing: 0.04em;
        font-weight: bold;
        line-height: 1.46;
      }
      &-icon.v-icon {
        font-size: 23px !important;
        line-height: 1 !important;
        position: relative;
        right: 12px;
      }
    }
  }
}
</style>
