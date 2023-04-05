<template>
  <v-row no-gutters>
    <v-col class="mb-6 text-center" cols="12">
      <span class="font-weight-bold text-h5">
        CHANGE PASSWORD
      </span>
    </v-col>

    <v-col cols="12">
      <v-row class="flex-column-reverse flex-md-row">
        <v-col class="px-6" cols="12" md="6">
          <update-password-form
            :loading="loading"
            :show-cancel="showCancel"
            @click:cancel="$emit('click:cancel')"
            @click:submit="onSubmit"
          />
        </v-col>

        <v-col class="px-6" cols="12" md="6">
          <v-img
            alt="Changing password"
            max-width="100%"
            :src="require('@/assets/jpg/art-activity-photo.jpg')"
          />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions } from 'vuex'

import UpdatePasswordForm from '@/components/forms/password/UpdatePasswordForm'

export default {
  name: 'UpdatePassword',

  components: {
    UpdatePasswordForm
  },

  props: {
    showCancel: {
      type: Boolean,
      required: false,
      default: true
    }
  },

  data: () => ({
    loading: false
  }),

  methods: {
    ...mapActions('auth/password', ['updateUserPassword']),
    ...mapActions('auth', ['fetchUserInfo']),

    async onSubmit (draft) {
      this.loading = true

      try {
        await this.updateUserPassword(draft)
        await this.fetchUserInfo()
        this.$toast.success('Password has been updated successfully!')
        this.$emit('update:success')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
