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
        List of Participants {{ getTopicMeeting }}
      </h4>
      <pg-admin-data-table
        :headers="headers"
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
        value: 'fullName'
      },
      {
        text: 'E-mail',
        align: 'start',
        sortable: false,
        value: 'email'
      },
      {
        text: 'Phone',
        align: 'start',
        sortable: false,
        value: 'phoneNumber'
      },
      {
        text: 'Role',
        align: 'start',
        sortable: false,
        value: 'role.name'
      }
    ]
  }),

  computed: {
    getTopicMeeting () {
      return (this.currentMeeting.title) ? this.currentMeeting.title : ''
    }
  },

  methods: {
    ...mapActions('coupons', ['getParticipants']),

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
