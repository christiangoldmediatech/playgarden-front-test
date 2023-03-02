<template>
  <pg-dialog
    v-model="modal"
    content-class="white"
    :fullscreen="isMobile"
    max-width="600"
    persistent
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        v-bind="attrs"
        color="#F89838"
        large
        class="rounded-0 white--text"
        elevation="0"
        v-on="on"
      >
        <v-icon color="white" left>
          mdi-plus-circle
        </v-icon>
        Add Caregiver
      </v-btn>
    </template>

    <v-col cols="12">
      <v-row class="pr-3" justify="end">
        <v-btn icon @click.stop="modal = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-row>

      <v-row justify="center">
        <div class="text-uppercase font-weight-bold text-h5 text-md-h4 grey--text text--darken-2">
          Add Caregiver
        </div>
      </v-row>

      <v-row v-if="modal" class="flex-column-reverse flex-md-row">
        <v-col class="pt-5 px-6" cols="12">
          <send-invitation-form
            :loading="loading"
            @click:cancel="onCancel"
            @click:submit="onSubmit"
          />
        </v-col>
      </v-row>
    </v-col>
  </pg-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { TAG_MANAGER_EVENTS } from '@/models'

import SendInvitationForm from '@/components/forms/caregiver/SendInvitationForm'

export default {
  name: 'AddCaregiver',

  components: {
    SendInvitationForm
  },

  data: () => ({
    loading: false,
    modal: false
  }),

  computed: {
    ...mapGetters('auth', {
      userInfo: 'getUserInfo'
    }),
    isMobile () {
      return this.$vuetify.breakpoint.mobile
    }
  },

  methods: {
    ...mapActions('caregiver', [
      'fetchCaregiverInvitationList',
      'sendCaregiverInvitation'
    ]),

    onCancel () {
      this.loading = false
      this.modal = false
    },

    async onSubmit (draft) {
      this.loading = true

      try {
        await this.sendCaregiverInvitation(draft)
        this.modal = false

        this.$snotify.success('Invitation has been sent successfully!')
        this.$nuxt.$emit('caregiver-added')
        this.$gtm.push({
          event: TAG_MANAGER_EVENTS.ACCOUNT_ADD_CAREGIVER,
          userId: this.userInfo.id
        })
      } catch (e) {
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.v-btn:not(.v-btn--text) {
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16) !important;
}
</style>
