<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <validation-observer v-slot="{ invalid, passes }">
          <p class="primary--text text-h5">
            Privacy Policy Management
          </p>

          <v-form @submit.prevent="passes(onSubmit)">
            <validation-provider
              v-slot="{ errors }"
              name="Privacy"
              rules="required"
            >
              <tiptap-field
                v-model="draft.termsConditions"
                :disabled="loading"
                :error-messages="errors"
                label="Privacy"
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
  name: 'TermsConditionsManagement',

  layout: 'admin',

  mixins: [submittable],

  data: () => ({
    loading: false
  }),

  async created () {
    try {
      this.loading = true

      this.draft = await this.getTermsConditions()
    } catch (e) {
    } finally {
      this.loading = false
    }
  },

  methods: {
    ...mapActions('terms-conditions', [
      'getTermsConditions',
      'updateTermsConditions'
    ]),

    async onSubmit () {
      this.loading = true

      try {
        await this.updateTermsConditions(await this.getSubmittableData())

        await this.$snotify.success(
          'Terms & Conditions has been successfully saved!',
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
