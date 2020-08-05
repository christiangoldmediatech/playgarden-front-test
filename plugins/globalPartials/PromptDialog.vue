<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="$vuetify.breakpoint.xs"
    max-width="500px"
    persistent
    scrollable
  >
    <v-card>
      <v-toolbar class="flex-grow-0" :color="color" :dark="dark" dense flat>
        <v-toolbar-title>
          {{ title }}
        </v-toolbar-title>

        <v-spacer />

        <v-btn :disabled="loading" icon @click.stop="close">
          <v-icon>
            mdi-close
          </v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-container>
          <p :class="contentClasses">
            {{ message }}
          </p>
        </v-container>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />

        <v-btn
          color="green"
          :dark="$vuetify.breakpoint.xs"
          :loading="loading"
          :text="$vuetify.breakpoint.smAndUp"
          @click="doAction"
        >
          Yes
        </v-btn>

        <v-btn
          color="red"
          :dark="$vuetify.breakpoint.xs"
          :disabled="loading"
          :text="$vuetify.breakpoint.smAndUp"
          @click="close"
        >
          No
        </v-btn>
      </v-card-actions>
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
      title: 'Do you wish to proceed?',
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
      title = 'Do you wish to proceed?',
      message = 'Are you sure you wish to proceed with this action?',
      contentClasses = '',
      action = () => {
        this.close()
      },
      dark = true,
      color = 'primary darken-1'
    }) {
      this.title = title
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
      } catch (err) {
        this.loading = false
        return
      } finally {
        this.close()
      }
    }
  }
}
</script>
