<template>
  <v-dialog
    :value="value"
    max-width="800"
    persistent
    @input="$emit('input', $event.target.value)"
  >
    <v-card>
      <div class="green-line green-line-1" />
      <div class="green-line green-line-2" />

      <v-img
        :src="require('@/assets/jpg/worksheets_completed_1.jpg')"
        contain
      >
        <v-container class="finish-background" fluid fill-height pa-0>
          <div class="d-flex flex-column fill-height align-center justify-end white--text">
            <div class="pa-2">
              <slot name="title">
                <span class="d-block text-center text-h3 font-weight-medium">
                  Coming Next:
                </span>
              </slot>
            </div>
            <div>
              <v-row justify="center">
                <v-col class="py-0" cols="12" md="8" lg="8" xl="4">
                  <slot>
                    <p class="text-center">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure assumenda rem, laudantium voluptas facere est corporis illo animi cupiditate amet magni quisquam praesentium dolores deserunt!
                    </p>
                  </slot>
                </v-col>
              </v-row>
            </div>
            <v-progress-linear v-if="showProgress" color="#f89838" :size="4" :value="progress" />
          </div>
        </v-container>
      </v-img>

      <v-container>
        <v-row class="flex-column" align="center">
          <v-col v-if="buttons.first" cols="12" sm="10" md="8" lg="7">
            <v-btn
              color="#f89838"
              class="white--text"
              :loading="loading"
              block
              @click.stop="doAction(buttons.first.action)"
            >
              <v-icon left>
                <!-- mdi-square-edit-outline -->
                {{ buttons.first.icon }}
              </v-icon>
              <!-- GO TO TEACHER’S VIDEO -->
              {{ buttons.first.text }}
            </v-btn>
          </v-col>

          <h5 class="text-h5 font-weight-bold">
            What do you want to do next?
          </h5>

          <v-col v-if="buttons.second" cols="12" sm="10" md="8" lg="7">
            <v-btn
              color="accent"
              class="white--text"
              :loading="loading"
              block
              @click.stop="doAction(buttons.second.action)"
            >
              <v-icon left>
                <!-- mdi-download-outline -->
                {{ buttons.second.icon }}
              </v-icon>
              <!-- DOWNLOAD HANDS-ON WORKSHEET -->
              {{ buttons.second.text }}
            </v-btn>
          </v-col>

          <v-col class="pb-1" cols="12">
            <v-btn
              color="primary"
              text
              block
              :disabled="loading"
              @click.stop="close"
            >
              RETURN TO DASHBOARD
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'CompletedMessage',

  props: {
    value: {
      type: Boolean,
      required: true
    },

    timeOut: {
      type: Number,
      required: false,
      default: 15
    },

    timeOutAction: {
      type: Function,
      required: false,
      default: () => {}
    },

    buttons: {
      type: Object,
      required: false,
      default: () => {
        return {}
      }
    },

    showProgress: {
      type: Boolean,
      required: false,
      default: true
    }
  },

  data: () => {
    return {
      loading: false,
      progress: 0,
      interval: null
    }
  },

  computed: {
    timeOutMs () {
      return this.timeOut * 1000
    }
  },

  watch: {
    value (val) {
      if (val) {
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
            this.close()
          }
        }, 25)
      }
    }
  },

  methods: {
    close () {
      this.stopInterval()
      this.$emit('input', false)
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
