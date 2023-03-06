<template>
  <pg-dialog
    v-model="modal"
    max-width="600"
    content-class="pg-bg-[#FFFCFC] py-2 !pg-rounded-3xl v2-font"
    @click:outside="closeDialog"
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

    <v-col class="text-right pg-pr-3" cols="12">
      <v-btn
        icon
        color="white"
        class="pg-bg-[#F6B7D2]"
        @click="closeDialog"
      >
        <v-icon>
          mdi-close
        </v-icon>
      </v-btn>
    </v-col>

    <v-row no-gutters>
      <v-col cols="12" class="px-16 mb-4">
        <p
          class="text-left pg-text-[25px] pg-text-[#707070] pg-font-[500]"
        >
          Add Caregiver
        </p>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col cols="12" class="px-16">
        <v-row v-if="modal" class="flex-column-reverse flex-md-row">
          <v-col cols="12">
            <send-invitation-form
              :loading="loading"
              @click:cancel="onCancel"
              @click:submit="onSubmit"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <img
      src="@/assets/svg/color-dashes.svg"
      class="pg-w-full pg-mb-[-12px] px-4"
    />
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

    closeDialog() {
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
