<template>
  <v-row no-gutters>
    <v-col cols="12">
      <profile-form
        :editing="editing"
        :loading="loading"
        :user="user"
        @click:cancel="editing = false"
        @click:submit="onSubmit"
      />

      <v-btn
        v-if="!editing"
        block
        class="mb-6"
        color="primary"
        x-large
        @click="editing = true"
      >
        EDIT PROFILE
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions } from 'vuex'

import ProfileForm from '@/components/forms/user/UpdateProfileForm'

export default {
  name: 'UpdateProfile',

  components: {
    ProfileForm
  },

  props: {
    user: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    loading: false,

    editing: false
  }),

  methods: {
    ...mapActions('auth', ['updateUserInfo']),

    async onSubmit (draft) {
      this.loading = true

      try {
        await this.updateUserInfo(draft)
        this.editing = false

        this.$toast.success('Profile has been updated successfully!')

        this.$emit('update:success')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
