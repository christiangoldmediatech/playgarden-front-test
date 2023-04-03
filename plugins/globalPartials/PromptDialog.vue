<template>
  <pg-dialog v-model="dialog" max-width="500px" persistent scrollable>
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

          <v-row v-if="isInputTextToConfirm" justify="center">
            <v-col class="text-center" cols="9">
              <p class="text-center">
                {{ confirmationText }}
              </p>
              <validation-provider v-slot="{ errors }" name="Confirmation Word">
                <pg-text-field
                  v-model="wordConfirm"
                  :error-messages="errors"
                  label="Confirmation Word"
                  class="custom-text-field"
                  solo-labeled
                />
              </validation-provider>
            </v-col>
          </v-row>
        </v-container>

        <p v-if="!isInputTextToConfirm" class="text-center" v-html="warning" />
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
            @click="doAction(onClose)"
          >
            {{ closeText }}
          </v-btn>

          <v-btn
            :color="isInputTextToConfirm ? 'red' : 'accent'"
            :dark="$vuetify.breakpoint.xs"
            :loading="loading"
            :disabled="isConfirmationBtnDisabled"
            width="120"
            class="text-transform-none  white--text"
            data-test-id="prompt-dialog-action-button"
            @click="doAction(onAction)"
          >
            {{ actionText }}
          </v-btn>
        </v-row>
      </v-card-actions>

      <div class="green-line green-line-2" />
      <div class="green-line green-line-1" />
    </v-card>
  </pg-dialog>
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
      wordConfirm: '',
      images: {
        correct: require('@/assets/svg/correct.svg'),
        delete: require('@/assets/svg/delete.svg')
      },
      isInputTextToConfirm: false,
      loading: false,
      message: 'Are you sure you wish to proceed with this action?',
      warning:
        'This item will be deleted immediately.<br>You can\'t undo this action!',
      confirmationText: 'To delete, write the word "Confirm"',
      confirmationWord: 'Confirm'
    }
  },

  computed: {
    isConfirmationValid () {
      return (this.isInputTextToConfirm && this.wordConfirm.toLowerCase() === this.confirmationWord.toLowerCase())
    },

    isConfirmationBtnDisabled () {
      return this.isInputTextToConfirm && !this.isConfirmationValid
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
      isInputTextToConfirm = false,
      color = 'primary darken-1',
      contentClasses = '',
      dark = true,
      image = '@/assets/svg/delete.svg',
      message = 'Are you sure you wish to proceed with this action?',
      warning = 'This item will be deleted immediately.<br>You can\'t undo this action!',
      confirmationText = 'To delete, write the word "Confirm"',
      confirmationWord = 'Confirm'
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
      this.isInputTextToConfirm = isInputTextToConfirm
      this.confirmationText = confirmationText
      this.confirmationWord = confirmationWord

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

<style lang="scss" scoped>
@import '~/assets/scss/app.scss';
</style>
