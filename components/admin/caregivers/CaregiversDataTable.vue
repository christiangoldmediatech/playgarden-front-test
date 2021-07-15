<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-title>
            Caregivers
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-text>
            <pg-admin-data-table
              :headers="headers"
              :items="caregivers"
              :loading="loading"
              :page.sync="page"
              :no-show-edit="true"
              :no-show-search="true"
              top-justify="space-between"
              @update:page="page = $event"
              @remove-item="remove"
              @refresh="refresh(true)"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'CaregiversDataTable',

  props: {
    id: {
      type: Number,
      required: true
    }
  },

  data () {
    return {
      loading: false,
      action: true,
      limit: 10,
      page: 1,
      caregivers: [],
      headers: [
        {
          text: 'FirstName',
          align: 'start',
          sortable: false,
          value: 'firstName'
        },
        {
          text: 'LastName',
          align: 'start',
          sortable: false,
          value: 'lastName'
        },
        {
          text: 'Email',
          align: 'start',
          sortable: false,
          value: 'email'
        },
        {
          text: 'Phone Number',
          align: 'start',
          sortable: false,
          value: 'phoneNumber'
        },
        {
          align: 'right',
          sortable: false,
          value: 'actions',
          width: 120
        }
      ]
    }
  },

  watch: {
    page () {
      this.refresh()
    },

    limit () {
      this.refresh()
    }
  },

  created () {
    this.refresh()
  },

  methods: {
    ...mapActions('caregiver', ['fetchCaregiversListByUserId', 'deleteCaregiver']),

    async refresh (clear = false) {
      this.loading = true
      try {
        const { users } = await this.fetchCaregiversListByUserId(this.id)
        this.caregivers = users
      } catch (e) {
      } finally {
        this.loading = false
      }
    },

    remove ({ id, firstName, lastName }) {
      this.$nuxt.$emit('open-prompt', {
        title: 'Delete Caregiver?',
        message: `Are you sure you want to delete <b>${firstName} ${lastName}</b>?`,
        action: async () => {
          await this.deleteCaregiver(id)
          this.refresh()
        }
      })
    }
  }
}
</script>
