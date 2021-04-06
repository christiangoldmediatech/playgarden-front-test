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
        block
        class="mb-6"
        color="primary"
        x-large
        v-on="on"
      >
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
import { mapActions } from 'vuex'

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
