<template>
  <v-row no-gutters>
    <!-- Desktop Title -->
    <v-col cols="12" class="d-none d-md-block">
      <div class="text-uppercase font-weight-bold text-h4 grey--text text--darken-2 pb-12">
        Caregivers
      </div>
    </v-col>

    <!-- Caregivers List Information -->
    <v-col cols="12" md="6" class="pr-md-8 mb-12 mb-md-0">
      <v-card class="pa-4 px-md-10 py-md-6 card-custom-border">
        <!-- Desktop SVG -->
        <div class="justify-center pb-8 d-none d-md-flex">
          <img
            height="154px"
            src="@/assets/svg/caregivers.svg"
          >
        </div>

        <!-- Mobile SVG and Title= -->
        <div class="d-flex d-md-none justify-center py-4">
          <img
            height="44px"
            src="@/assets/svg/caregivers.svg"
          >
          <span class="text-uppercase font-weight-bold text-h5 grey--text text--darken-2 mt-1 ml-2">
            Caregivers
          </span>
        </div>

        <div class="text-center body-1 text-md-h6 font-weight-medium grey--text text--darken-2 mt-2 mb-8">
          Here is a brief description about caregivers
        </div>

        <!-- List -->
        <v-row
          v-for="(caregiver, caregiverIndex) in caregivers"
          :key="caregiver.id"
          no-gutters
        >
          <v-col cols="12" class="text-h6 text-md-h5 grey--text mb-3">
            Caregiver {{ caregiverIndex + 1 }}
          </v-col>

          <v-col cols="11" class="text-h6 text-md-h5 grey--text font-weight-bold text-truncate">
            {{ caregiver.firstName }}
          </v-col>

          <v-col v-if="isEditing" cols="1" class="d-flex justify-end">
            <v-btn color="accent" icon text @click="remove(caregiver)">
              <v-icon>
                mdi-close-circle-outline
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <v-btn
          v-if="!isEditing"
          x-large
          block
          color="primary mt-6"
          @click="isEditing = true"
        >
          Edit
        </v-btn>
      </v-card>
    </v-col>

    <v-col cols="12" md="6" class="pl-md-8 mb-12 mb-md-0">
      <v-card class="pa-4 px-md-10 py-md-6 mb-12 card-custom-border">
        <v-row no-gutters>
          <!-- Plan Name-->
          <v-col cols="12" class="text-center">
            <div class="text-uppercase font-weight-bold text-h5 grey--text text--darken-2 mb-6">
              Pending Invites Sent
            </div>
          </v-col>

          <v-col cols="12">
            <invitation-list />
          </v-col>
        </v-row>
      </v-card>

      <add-caregiver />
    </v-col>
  </v-row>
</template>

<script>
import { mapActions } from 'vuex'
import AddCaregiver from '@/components/app/caregiver/AddCaregiver'
import InvitationList from '@/components/app/caregiver/InvitationList'

export default {
  name: 'CaregiverList',

  components: {
    InvitationList,
    AddCaregiver
  },

  data () {
    return {
      isEditing: false,
      caregivers: [],
      loading: false
    }
  },

  mounted () {
    this.getCaregiversData()
  },

  methods: {
    ...mapActions('caregiver', ['fetchCaregiversList', 'deleteCaregiver']),

    async getCaregiversData () {
      try {
        this.loading = true
        const { users } = await this.fetchCaregiversList()
        this.caregivers = users
      } catch (e) {
      } finally {
        this.loading = false
      }
    },

    remove ({ id, firstName }) {
      this.$nuxt.$emit('open-prompt', {
        title: 'Delete caregiver?',
        message: `Are you sure you want to delete <b>${firstName}</b>?`,
        action: () => this.deleteCaregiver(id).then(this.getCaregiversData)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.card-custom-border {
  box-shadow: 0px 4px 14px rgba(0, 0, 0, 0.25) !important;
  border-radius: 8px !important;
}

.v-btn:not(.v-btn--text) {
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16) !important;
}
</style>
