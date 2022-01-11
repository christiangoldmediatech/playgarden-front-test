<template>
  <validation-observer ref="obs" v-slot="{ invalid, passes }">
    <v-dialog
      v-model="dialog"
      :fullscreen="$vuetify.breakpoint.xs"
      max-width="900px"
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
          <v-container>
            <v-form ref="activityTypeFormRef" @submit.prevent="passes(save)">
              <v-row>
                <v-col cols="12" sm="12" md="6">
                  <validation-provider
                    v-slot="{ errors }"
                    name="Name"
                    rules="required"
                  >
                    <pg-text-field
                      v-model="item.name"
                      :error-messages="errors"
                      label="Name"
                      solo-labeled
                    />
                  </validation-provider>

                  <label class="mb-3">Benefits:</label>
                  <features-edit-plan ref="benefitsRef" :list="plansFeatures.benefits" mode="benefits" />
                </v-col>
                <v-col cols="12" sm="12" md="6">
                  <validation-provider
                    v-slot="{ errors }"
                    name="Plan Name"
                    rules="required"
                  >
                    <pg-text-field
                      v-model="item.planName"
                      :error-messages="errors"
                      label="Plan Name"
                      solo-labeled
                    />
                  </validation-provider>

                  <div v-if="item.id !== 1">
                    <label class="mb-3">Promotions:</label>

                    <features-edit-plan ref="promotionsRef" :list="plansFeatures.promotions" mode="promotions" />
                  </div>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />

          <v-btn
            color="green"
            :disabled="invalid"
            :loading="loading"
            :text="$vuetify.breakpoint.smAndUp"
            @click.stop="passes(save)"
          >
            Save
          </v-btn>

          <v-btn
            color="red"
            :disabled="loading"
            :text="$vuetify.breakpoint.smAndUp"
            @click.stop="close"
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </validation-observer>
</template>

<script>
import { mapActions } from 'vuex'
import FeaturesEditPlan from '@/components/admin/plans/FeaturesEditPlan'

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
  name: 'PlanEditorDialog',

  components: {
    FeaturesEditPlan
  },

  data () {
    return {
      dialog: false,
      loading: false,
      plansFeatures: {
        benefits: [],
        promotions: []
      },
      id: null,
      item: generateItemTemplate()
    }
  },

  computed: {
    title () {
      return this.item.id === null ? 'New Plan' : 'Edit Plan'
    },

    getFeatures () {
      return this.item.id === null ? 'New Plan' : 'Edit Plan'
    }
  },

  methods: {
    ...mapActions('plans', ['updatePlan']),

    close () {
      this.$nextTick(() => {
        this.dialog = false
        this.loading = false
        this.$refs.obs.reset()
      })
    },

    cleanFields (obj) {
      Object.keys(obj).forEach((key) => {
        if (obj[key] === null || obj[key] === undefined) {
          delete obj[key]
        }
      })
      return obj
    },

    formatFeactures (list) {
      return list.map((feature) => {
        return feature.value
      })
    },

    async save () {
      this.loading = true
      if (this.item.id === 1) {
        this.item.commonBenefits.benefits = this.formatFeactures(this.$refs.benefitsRef.componentList)
      }

      if (this.item.id === 2) {
        this.item.homeDeliveryBenefits.benefits = this.formatFeactures(this.$refs.benefitsRef.componentList)
        this.item.homeDeliveryBenefits.promotions = this.formatFeactures(this.$refs.promotionsRef.componentList)
      }

      if (this.item.id === 3) {
        this.item.plusBenefits.benefits = this.formatFeactures(this.$refs.benefitsRef.componentList)
        this.item.plusBenefits.promotions = this.formatFeactures(this.$refs.promotionsRef.componentList)
      }
      try {
        this.item = this.cleanFields(this.item)
        await this.updatePlan({ id: this.item.id, data: this.item })
        this.$emit('saved')
        this.plansFeatures = {
          benefits: [],
          promotions: []
        }
        this.close()
      } catch (err) {
      } finally {
        this.loading = false
      }
    },

    resetItem () {
      this.item = generateItemTemplate()
    },

    loadItem (item) {
      this.item.id = item.id
      this.item.name = item.name
      this.item.planName = item.planName

      if (this.item.id === 1) {
        this.plansFeatures.benefits = (item.commonBenefits.benefits) ? item.commonBenefits.benefits : []
      }

      if (this.item.id === 2) {
        this.plansFeatures.benefits = (item.homeDeliveryBenefits.benefits) ? item.homeDeliveryBenefits.benefits : []
        this.plansFeatures.promotions = (item.homeDeliveryBenefits.promotions) ? item.homeDeliveryBenefits.promotions : []
      }

      if (this.item.id === 3) {
        this.plansFeatures.benefits = (item.plusBenefits.benefits) ? item.plusBenefits.benefits : []
        this.plansFeatures.promotions = (item.plusBenefits.promotions) ? item.plusBenefits.promotions : []
      }
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
