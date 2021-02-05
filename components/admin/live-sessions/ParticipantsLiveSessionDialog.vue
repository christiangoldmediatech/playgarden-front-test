<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="$vuetify.breakpoint.xs"
    max-width="770px"
    persistent
    scrollable
  >
    <v-card>
      <h4 class="mt-10 ml-6">
        List of assistants - {{ getTopicMeeting }}
      </h4>
      <v-data-table
        class="mt-4"
        :headers="headers"
        hide-default-footer
        :items="participants"
        :loading="loading"
        @refresh="refresh(true)"
      />
      <v-card-actions>
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
  name: 'ParticipantsLiveSessionDialog',

  data: () => ({
    dialog: false,
    loading: false,
    currentMeeting: null,
    participants: [],
    headers: [
      {
        text: 'Name',
        align: 'start',
        sortable: false,
        value: 'user.fullName'
      },
      {
        text: 'E-mail',
        align: 'start',
        sortable: false,
        value: 'user.email'
      },
      {
        text: 'Phone',
        align: 'start',
        sortable: false,
        value: 'user.phoneNumber'
      },
      {
        text: 'Role',
        align: 'start',
        sortable: false,
        value: 'user.role.name'
      }
    ]
  }),

  computed: {
    getTopicMeeting () {
      return (this.currentMeeting && this.currentMeeting.title) ? this.currentMeeting.title : ''
    }
  },

  methods: {
    ...mapActions('live-sessions', ['getParticipants']),

    async refresh (clear = false) {
      this.loading = true
      try {
        this.participants = await this.getParticipants(this.currentMeeting.id)
      } catch (e) {
      } finally {
        this.loading = false
      }
    },

    close () {
      this.$nextTick(() => {
        this.dialog = false
        this.loading = false
      })
    },

    open (evt, item = null) {
      this.currentMeeting = item
      this.refresh()
      this.$nextTick(() => {
        this.dialog = true
      })
    }
  }
}
</script>

<style lang="scss">
.collaborator-image {
  width: 100%;
  max-width: 100%;
}
</style>
