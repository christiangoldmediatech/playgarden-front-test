<template>
  <v-row>
    <v-col cols="12">
      <p class="font-weight-bold">
        VERIFIED CAREGIVERS
      </p>

      <v-row
        v-for="caregiver in caregivers"
        :key="caregiver.id"
        align="center"
        class="my-1 px-md-6"
        no-gutters
      >
        <v-col class="text-truncate">
          {{ caregiver.firstName }}
        </v-col>

        <v-col v-if="deletable" class="text-right" cols="1">
          <v-btn color="accent" icon text @click="remove(caregiver)">
            <v-icon>
              mdi-close-circle-outline
            </v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'CaregiverList',

  props: {
    deletable: Boolean
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
        message: `Are you sure you want to delete <b>${firstName}</b>?`,
        action: () => this.deleteCaregiver(id).then(this.getCaregiversData)
      })
    }
  }
}
</script>
