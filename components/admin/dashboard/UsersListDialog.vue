<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="$vuetify.breakpoint.xs"
    max-width="900px"
    persistent
    scrollable
  >
    <v-card>
      <v-toolbar class="flex-grow-0" color="primary darken-1" dark dense flat>
        <v-toolbar-title class="white--text">
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
          <label>List users</label>
        </v-container>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />

        <v-btn
          class="white--text"
          color="red"
          :disabled="loading"
          :text="$vuetify.breakpoint.smAndUp"
          @click.stop="close"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'UsersListDialog',

  components: {},

  data () {
    return {
      dialog: false,
      loading: false,
      item: null
    }
  },

  computed: {
    title () {
      return 'List Users'
    }
  },

  methods: {
    ...mapActions('plans', ['updatePlan']),

    close () {
      this.$nextTick(() => {
        this.dialog = false
        this.loading = false
      })
    },

    loadItem (item) {
      this.item = item
    },

    open (evt, item = null) {
      if (item) {
        this.loadItem(item)
      }

      this.$nextTick(() => {
        this.dialog = true
      })
    }
  }
}
</script>
