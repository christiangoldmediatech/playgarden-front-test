<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="$vuetify.breakpoint.xs"
    max-width="500px"
    persistent
    scrollable
  >
    <v-card>
      <v-toolbar class="flex-grow-0" color="primary darken-1" dark dense flat>
        <v-toolbar-title class="white--text">
          {{ title }}
        </v-toolbar-title>

        <v-spacer />

        <v-btn :disabled="loading" icon @click.stop="close">
          <v-icon>
            mdi-close
          </v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-row align="center">
          <!-- Plan Information -->
          <v-col cols="12">
            <v-card class="pa-4 px-md-10 py-md-6 card-custom-border">
              <v-row no-gutters>
                <!-- Plan Name-->
                <v-col cols="12" class="text-center">
                  <v-btn class="warning mb-8" depressed width="160px">
                    {{ plan.planName }}
                  </v-btn>
                </v-col>

                <!-- Plan Name -->
                <v-col v-if="plan.name" cols="12" class="mb-4 text-center">
                  <underlined-title :text="plan.name" font-size="32px" />
                </v-col>
                <v-col cols="12" class="mb-10 mx-0 mx-lg-12">
                  <plan-description
                    v-if="Object.keys(plan).length"
                    :plan="plan"
                  />
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import PlanDescription from '@/components/app/payment/SubscriptionPlanSelection/PlanDescription'

function generateItemTemplate () {
  return {
    name: null,
    planName: null,
    commonBenefits: {
      benefits: []
    },
    homeDeliveryBenefits: {
      benefits: [],
      promotions: []
    },
    plusBenefits: {
      benefits: [],
      promotions: []
    }
  }
}

export default {
  name: 'PlanViewDialog',

  components: {
    PlanDescription
  },

  data () {
    return {
      dialog: false,
      loading: false,
      plan: {
        planName: ''
      }
    }
  },

  computed: {
    title () {
      return this.plan.planName
    }
  },

  methods: {

    close () {
      this.$nextTick(() => {
        this.dialog = false
        this.loading = false
      })
    },

    resetItem () {
      this.item = generateItemTemplate()
    },

    loadItem (item) {
      this.plan = item
    },

    open (evt, item = null) {
      this.resetItem()

      if (item) {
        this.loadItem(item)
      }

      this.$nextTick(() => {
        this.dialog = true
      })
    }
  }
}
</script>
