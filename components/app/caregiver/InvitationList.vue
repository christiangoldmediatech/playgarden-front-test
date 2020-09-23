<template>
  <v-row>
    <v-col cols="12">
      <p class="font-weight-bold">
        INVITES SENT
      </p>

      <v-row
        v-for="({ id, email, phone }, indexIS) in invitationSent"
        :key="indexIS"
        class="my-1 px-md-6"
        no-gutters
      >
        <v-col class="text-truncate">
          {{ email || phone }}
        </v-col>

        <v-col class="shrink">
          <div>
            <v-btn
              color="accent"
              icon
              :loading="loading"
              x-small
              text
              @click="onResend({ email, phone })"
            >
              <v-icon>
                mdi-email-sync-outline
              </v-icon>
            </v-btn>

            <v-btn
              color="accent"
              icon
              :loading="loading"
              x-small
              text
              @click="onDelete(id)"
            >
              <v-icon>
                mdi-close-circle-outline
              </v-icon>
            </v-btn>
          </div>
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
      'deleteCaregiverInvitation',
      'resendCaregiverInvitation'
    ]),

    async getInvitationList () {
      this.invitationSent = await this.fetchCaregiverInvitationList()
    },

    async onDelete (id) {
      this.loading = true

      try {
        await this.deleteCaregiverInvitation({ id })

        this.$snotify.success('Invitation has been deleted successfully!')

        this.getInvitationList()
      } catch (e) {
      } finally {
        this.loading = false
      }
    },

    async onResend (data) {
      this.loading = true

      try {
        await this.resendCaregiverInvitation(data)

        this.$snotify.success('Invitation has been resent successfully!')
      } catch (e) {
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.shrink > div {
  width: 45px;
}
</style>
