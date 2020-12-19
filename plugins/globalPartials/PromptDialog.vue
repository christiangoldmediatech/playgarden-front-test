<template>
  <v-dialog v-model="dialog" max-width="500px" persistent scrollable>
    <v-card>
      <div class="green-line green-line-1" />
      <div class="green-line green-line-2" />

      <v-card-text>
        <v-container>
          <v-row justify="center">
            <v-img
              alt="delete"
              class="mb-3"
              contain
              :max-height="80"
              :src="require('~/assets/svg/delete.svg')"
            />
          </v-row>
          <v-row justify="center">
            <v-col class="text-center" cols="12" lg="9">
              <underlined-title
                class="text-h6 text-md-subtitle-1 font-weight-medium text-center"
                :text="(message)"
              />
            </v-col>
          </v-row>
        </v-container>

        <p class="text-center">
          This item will be deleted immediatly.<br>
          You can't undo this action!
        </p>
      </v-card-text>

      <v-card-actions>
        <v-row justify="center" no-gutters class="mb-5">
          <v-btn
            color="#D7D7D7"
            :dark="$vuetify.breakpoint.xs"
            :disabled="loading"
            width="120"
            class="mr-5 white--text custom-text"
            @click="close"
          >
            Cancel
          </v-btn>

          <v-btn
            color="accent"
            :dark="$vuetify.breakpoint.xs"
            :loading="loading"
            width="120"
            class="custom-text"
            @click="doAction"
          >
            Delete it!
          </v-btn>
        </v-row>
      </v-card-actions>
      <div class="green-line green-line-2" />
      <div class="green-line green-line-1" />
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'PromptDialog',

  props: {
    eventTrigger: {
      type: String,
      required: false,
      default: 'open-prompt'
    }
  },

  data () {
    return {
      dialog: false,
      loading: false,
      message: 'Are you sure you wish to proceed with this action?',
      contentClasses: '',
      color: 'primary darken-1',
      dark: true,
      action: () => {
        this.close()
      }
    }
  },

  created () {
    this.$nuxt.$on(this.eventTrigger, (params) => {
      this.open(params)
    })
  },

  methods: {
    open ({
      message = 'Are you sure you wish to proceed with this action?',
      contentClasses = '',
      action = () => {
        this.close()
      },
      dark = true,
      color = 'primary darken-1'
    }) {
      this.message = message
      this.contentClasses = contentClasses
      this.action = action
      this.color = color
      this.dark = dark
      this.$nextTick(() => {
        this.dialog = true
      })
    },

    close () {
      this.$nextTick(() => {
        this.dialog = false
        this.loading = false
      })
    },

    async doAction () {
      this.loading = true
      try {
        await this.action()
        this.dialog = false
      } catch (e) {
        this.$snotify.error('Something went wrong!')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-text {
  text-transform: none !important;
}
</style>
