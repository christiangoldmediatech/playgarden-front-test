<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card class="mb-6" width="100%">
          <v-card-title>
            Privacy Policy Management
          </v-card-title>
        </v-card>

        <validation-observer v-slot="{ invalid, passes }">
          <v-form @submit.prevent="passes(onSubmit)">
            <validation-provider
              v-slot="{ errors }"
              name="Privacy"
              rules="required"
            >
              <tiptap-field
                v-model="draft.privacy"
                :disabled="loading"
                :error-messages="errors"
              />
            </validation-provider>

            <v-btn
              block
              class="mb-6"
              color="primary"
              :disabled="invalid"
              :loading="loading"
              type="submit"
              x-large
            >
              UPDATE
            </v-btn>
          </v-form>
        </validation-observer>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'

import submittable from '@/utils/mixins/submittable'

export default {
  name: 'PrivacyPolicyManagement',

  layout: 'admin',

  mixins: [submittable],

  data: () => ({
    loading: false
  }),

  async created () {
    try {
      this.loading = true

      this.draft = await this.getPrivacyPolicy()
    } catch (e) {
    } finally {
      this.loading = false
    }
  },

  methods: {
    ...mapActions('privacy-policy', [
      'getPrivacyPolicy',
      'updatePrivacyPolicy'
    ]),

    async onSubmit () {
      this.loading = true

      try {
        await this.updatePrivacyPolicy(await this.getSubmittableData())

        await this.$snotify.success(
          'Privacy Policy has been successfully saved!',
          'Congratulations'
        )
      } catch (e) {
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
