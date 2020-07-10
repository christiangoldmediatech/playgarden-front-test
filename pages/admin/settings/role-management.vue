<template>
  <v-container>
    <v-card>
      <v-toolbar
        color="accent darken-1"
        dark
        flat
      >
        <v-toolbar-title>
          Role Management
        </v-toolbar-title>
      </v-toolbar>

      <v-card-text>
        <p>View, create, update, or delete roles.</p>

        <roles-data-table ref="RolesDataTable" />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import RolesDataTable from '@/components/admin/roles/RolesDataTable.vue'

export default {
  name: 'RoleManagement',

  layout: 'admin',

  components: {
    RolesDataTable
  },

  data () {
    return {}
  },

  mounted () {
    this.$refs.RolesDataTable.refresh()
  }
}
</script>
