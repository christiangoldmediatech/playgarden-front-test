<template>
  <v-row no-gutters>
    <v-col v-if="invitationSent.length === 0" cols="12">
      <p class="account-caregiver-subtitle ma-0">
        You don´t have any pending invites
      </p>
    </v-col>
    <v-col v-else cols="12">
      <v-row
        v-for="({ id, email, phone }, indexIS) in invitationSent"
        :key="indexIS"
        align="center"
        class="my-1"
        no-gutters
      >
        <v-col class="text-truncate grey--text">
          {{ email || phone }}
        </v-col>

        <v-col class="shrink">
          <div>
            <v-btn
              color="primary"
              icon
              :loading="loading"
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
              text
              @click="onDelete({ id, email, phone })"
            >
              <v-icon>
                mdi-close-circle-outline
              </v-icon>
            </v-btn>
          </div>
        </v-col>
      </v-row>
      <v-row
        v-if="!hasSentInvites && !loading"
        no-gutters
        justify="center"
        class="my-1 px-md-6 grey--text"
      >
        You don't have any pending invites
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

  computed: {
    hasSentInvites () {
      return this.invitationSent.length > 0
    }
  },

  created () {
    this.getInvitationList()

    this.$nuxt.$on('caregiver-added', () => {
      this.getInvitationList()
    })
  },

  beforeDestroy () {
    this.$nuxt.$off('caregiver-added')
  },

  methods: {
    ...mapActions('caregiver', [
      'fetchCaregiverInvitationList',
      'deleteCaregiverInvitation',
      'resendCaregiverInvitation'
    ]),

    async getInvitationList () {
      this.loading = true
      this.invitationSent = await this.fetchCaregiverInvitationList()
      this.loading = false
    },

    onDelete ({ id, email, phone }) {
      this.$nuxt.$emit('open-prompt', {
        title: 'Delete invitation?',
        message: `Are you sure you want to delete <b>${email ||
          phone}</b>?`,
        action: () => this.confirmDelete(id)
      })
    },

    async confirmDelete (id) {
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
  width: 77px;
}
</style>
