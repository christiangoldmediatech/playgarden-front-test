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
        <span>
          {{ caregiver.firstName }}
        </span>

        <div>
          {{ caregiver.email }}

          <v-icon color="#d30909" dense @click="remove(caregiver)">
            mdi-delete-outline
          </v-icon>
        </div>
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
        message: `Are you sure you wish to delete '${firstName}' caregiver?`,
        action: () => this.deleteCaregiver(id).then(this.getCaregiversData)
      })
    }
  }
}
</script>
