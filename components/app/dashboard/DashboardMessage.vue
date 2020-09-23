<template>
  <v-card v-bind="{ ...$attrs }">
    <div class="green-line green-line-1" />
    <div class="green-line green-line-2" />

    <v-img
      :src="backgroundImage"
      class="align-end white--text"
      gradient="to top, rgba(39, 39, 39, 0.9), rgba(255, 255, 255, 0) 80%"
      contain
    >
      <v-row justify="center">
        <v-col class="text-center" cols="12">
          <slot name="title">
            <span class="text-h3 font-weight-medium">
              Coming Next:
            </span>
          </slot>
        </v-col>
        <v-col class="py-0" cols="12" md="8" lg="8" xl="4">
          <slot />
        </v-col>
      </v-row>
      <v-progress-linear v-if="timeOut" color="#f89838" :size="4" :value="progress" />
    </v-img>

    <v-container>
      <v-row class="flex-column" align="center">
        <h5 class="text-h5 font-weight-bold">
          What do you want to do next?
        </h5>

        <v-col
          v-for="(button, i) in buttons"
          :key="`complete-message-${_uid}-button-${i}`"
          cols="12"
          sm="10"
          md="8"
          lg="7"
        >
          <v-btn
            :color="button.color"
            class="white--text"
            :loading="loading"
            block
            @click.stop="doAction(button.action)"
          >
            <v-icon v-if="button.iconLeft" large left>
              {{ button.iconLeft }}
            </v-icon>
            {{ button.text }}
            <v-icon v-if="button.iconRight" right left>
              {{ button.iconRight }}
            </v-icon>
          </v-btn>
        </v-col>

        <v-col v-if="returnText" class="pb-1" cols="12">
          <v-btn
            color="primary"
            text
            block
            :disabled="loading"
            @click.stop="doReturnAction"
          >
            {{ returnText }}
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
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
      default: 'RETURN TO DASHBOARD'
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
    timeOutMs () {
      return this.timeOut * 1000
    }
  },

  methods: {
    doReturnAction () {
      this.stopInterval()
      this.returnAction()
    },

    startInterval () {
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

    stopInterval () {
      if (this.interval) {
        window.clearInterval(this.interval)
        this.interval = null
      }
    },

    async doAction (action) {
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

<style lang="scss" scoped>
.finish-background {
  background: linear-gradient(to top, rgba(39, 39, 39, 0.9), rgba(255, 255, 255, 0) 80%);
}
</style>
