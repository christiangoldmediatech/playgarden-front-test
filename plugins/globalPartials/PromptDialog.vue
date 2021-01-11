<template>
  <v-dialog v-model="dialog" max-width="500px" persistent scrollable>
    <v-card>
      <div class="green-line green-line-1" />
      <div class="green-line green-line-2" />

      <v-card-text>
        <v-container>
          <v-row justify="center">
            <v-img
              v-if="image"
              alt="delete"
              class="mb-3"
              contain
              :max-height="80"
              :src="images[image]"
            />
          </v-row>

          <v-row justify="center">
            <v-col class="text-center" cols="12" lg="9">
              <underlined-title
                class="text-h6 text-md-subtitle-1 font-weight-medium text-center"
                :text="message"
              />
            </v-col>
          </v-row>
        </v-container>

        <p class="text-center" v-html="warning" />
      </v-card-text>

      <v-card-actions>
        <v-row justify="center" no-gutters class="mb-5">
          <template v-if="closeButton">
            <v-btn
              color="#D7D7D7"
              :dark="$vuetify.breakpoint.xs"
              :disabled="loading"
              width="120"
              class="mr-5 white--text text-transform-none"
              @click="closeDialog"
            >
              Close
            </v-btn>

            <v-spacer />
          </template>

          <v-btn
            color="#D7D7D7"
            :dark="$vuetify.breakpoint.xs"
            :disabled="loading"
            width="120"
            class="mr-5 white--text text-transform-none"
            @click="doAction(onAction)"
          >
            {{ closeText }}
          </v-btn>

          <v-btn
            color="accent"
            :dark="$vuetify.breakpoint.xs"
            :loading="loading"
            width="120"
            class="text-transform-none"
            @click="doAction(onClose)"
          >
            {{ actionText }}
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
      color: 'primary darken-1',
      onAction: () => {
        this.closeDialog()
      },
      actionText: 'Delete it!',
      onClose: () => {
        this.closeDialog()
      },
      closeButton: false,
      closeText: 'Cancel',
      contentClasses: '',
      dialog: false,
      dark: true,
      image: 'delete',
      images: {
        correct: require('@/assets/svg/correct.svg'),
        delete: require('@/assets/svg/delete.svg')
      },
      loading: false,
      message: 'Are you sure you wish to proceed with this action?',
      warning:
        'This item will be deleted immediately.<br>You can\'t undo this action!'
    }
  },

  created () {
    this.$nuxt.$on(this.eventTrigger, (params) => {
      this.open(params)
    })
  },

  beforeDestroy () {
    this.$nuxt.$off(this.eventTrigger)
  },

  methods: {
    open ({
      action = this.closeDialog,
      actionText = 'Delete it!',
      close = this.closeDialog,
      closeButton = false,
      closeText = 'Close',
      color = 'primary darken-1',
      contentClasses = '',
      dark = true,
      image = '@/assets/svg/delete.svg',
      message = 'Are you sure you wish to proceed with this action?',
      warning = 'This item will be deleted immediately.<br>You can\'t undo this action!'
    } = {}) {
      this.onAction = action
      this.actionText = actionText
      this.onClose = close
      this.closeButton = closeButton
      this.closeText = closeText
      this.color = color
      this.contentClasses = contentClasses
      this.dark = dark
      this.image = image
      this.message = message
      this.warning = warning

      this.$nextTick(() => {
        this.dialog = true
      })
    },

    closeDialog () {
      this.$nextTick(() => {
        this.dialog = false
        this.loading = false
      })
    },

    async doAction (action) {
      this.loading = true

      try {
        await action()
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
