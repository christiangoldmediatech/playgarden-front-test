<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-row v-if="loading" align="center" fill-height justify="center">
          <v-col class="text-center" cols="4">
            <div>
              <img class="logo-img" src="@/assets/svg/logo.svg">
            </div>

            <v-progress-linear color="primary" indeterminate :size="20" />
          </v-col>
        </v-row>

        <div v-else v-html="data" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'TermsConditions',

  data: () => ({
    loading: true,
    data: null
  }),

  async created () {
    try {
      this.data = await this.getTermsConditions()
    } catch (e) {
    } finally {
      this.loading = false
    }
  },

  methods: mapActions('terms-conditions', ['getTermsConditions'])
}
</script>
