<template>
  <pg-dialog
    v-model="modal"
    content-class="white"
    :fullscreen="$vuetify.breakpoint.smAndDown"
    max-width="1000"
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
        MANAGE CAREGIVERS
      </v-btn>
    </template>

    <v-col cols="12">
      <v-row class="pr-3" justify="end">
        <v-btn icon @click.stop="modal = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-row>

      <v-row class="pr-3" justify="center">
        <span class="font-weight-bold text-h5">
          MANAGE CAREGIVERS
        </span>
      </v-row>

      <v-row v-if="modal" class="flex-column-reverse flex-md-row">
        <v-col class="pt-5 px-6" cols="12" md="6">
          <send-invitation-form
            :loading="loading"
            @click:cancel="onCancel"
            @click:submit="onSubmit"
          />
        </v-col>

        <v-col class="px-6" cols="12" md="6">
          <caregiver-list deletable />

          <invitation-list />
        </v-col>
      </v-row>
    </v-col>
  </pg-dialog>
</template>

<script>
import { mapActions } from 'vuex'

import CaregiverList from '@/components/app/caregiver/CaregiverList'
import SendInvitationForm from '@/components/forms/caregiver/SendInvitationForm'
import InvitationList from '@/components/app/caregiver/InvitationList'

export default {
  name: 'ManageCaregivers',

  components: {
    CaregiverList,
    SendInvitationForm,
    InvitationList
  },

  data: () => ({
    loading: false,
    modal: false
  }),

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

        this.$toast.success('Invitation has been sent successfully!')
      } catch (e) {
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
