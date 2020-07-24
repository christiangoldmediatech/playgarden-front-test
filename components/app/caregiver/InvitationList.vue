<template>
  <v-row>
    <v-col v-if="invitationSent.length" cols="12">
      <v-row class="pr-3" justify="center">
        <span class="font-weight-bold text-h5">
          RESEND INVITATION
        </span>
      </v-row>

      <v-row class="pr-3">
        <v-col cols="12">
          <v-row
            v-for="({ email }, indexIS) in invitationSent"
            :key="indexIS"
            justify="space-between"
          >
            {{ email }}

            <v-btn
              color="accent"
              :loading="loading"
              x-small
              text
              @click="onResend(email)"
            >
              RESEND
            </v-btn>
          </v-row>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'InvitationList',

  data: () => ({
    invitationSent: [],
    loading: false
  }),

  created () {
    this.getInvitationList()
  },

  methods: {
    ...mapActions('caregiver', [
      'fetchCaregiverInvitationList',
      'resendCaregiverInvitation'
    ]),

    async getInvitationList () {
      this.invitationSent = await this.fetchCaregiverInvitationList()
    },

    async onResend (email) {
      this.loading = true

      try {
        await this.resendCaregiverInvitation(email)

        this.$snotify.success('Invitation has been resent successfully!')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
