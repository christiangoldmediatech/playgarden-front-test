<template>
  <v-row>
    <v-col cols="12">
      <p class="font-weight-bold">
        CAREGIVERS
      </p>

      <v-row
        v-for="caregiver in caregivers"
        :key="caregiver.id"
        class="justify-space-between my-1"
        no-gutters
      >
        <span class="caregivers-list-text">
          {{ caregiver.firstName }}
        </span>

        <span class="caregivers-list-text">
          {{ caregiver.email }}
        </span>
      </v-row>

      <manage-caregivers class="my-6" />
    </v-col>
  </v-row>
</template>

<script>
import { mapActions } from 'vuex'

import ManageCaregivers from '@/components/app/caregiver/ManageCaregivers'

export default {
  name: 'CaregiverList',

  components: {
    ManageCaregivers
  },

  data () {
    return {
      caregivers: [],
      loading: false
    }
  },

  mounted () {
    this.getCaregiversData()
  },

  methods: {
    ...mapActions('caregiver', ['fetchCaregiversList']),

    async getCaregiversData () {
      try {
        this.loading = true
        const { users } = await this.fetchCaregiversList()
        this.caregivers = users
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
