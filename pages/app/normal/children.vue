<template>
  <v-row :class="{'mt-10': !noBackMode}">
    <v-row v-if="noBackMode" no-gutters class="mt-12">
      <v-btn
        color="accent"
        nuxt
        text
        @click="showBackWarning = true"
      >
        <v-icon left>
          mdi-less-than
        </v-icon>

        {{ $t('commonWords.backButton') }}
      </v-btn>
    </v-row>
    <back-warning-dialog v-model="showBackWarning" />
    <v-col cols="12">
      <step-three />
    </v-col>
  </v-row>
</template>

<script>
import StepThree from '@/components/app/register/StepThree.vue'
import BackWarningDialog from '@/components/app/register/BackWarningDialog.vue'

export default {
  name: 'Children',

  components: {
    StepThree,
    BackWarningDialog
  },

  data: () => ({
    showBackWarning: false
  }),

  computed: {
    noBackMode() {
      return !(this.$route.query.mode === 'no-back')
    }
  },

  created () {
    this.$gtm.push({
      event: 'payment_children_page',
      conversionID: '959213252',
      conversionLabel: 'q4IlCNbg0voBEMTdsckD'
    })
  }
}
</script>
