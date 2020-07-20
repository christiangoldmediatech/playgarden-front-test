<template>
  <users-data-table ref="UsersDataTable" />
  <!--
  <v-container>
    <v-card>
      <v-toolbar
        color="accent darken-1"
        dark
        flat
      >
        <v-toolbar-title>
          Users
        </v-toolbar-title>
      </v-toolbar>

      <v-card-text>
        <p>View, create, update, or delete users.</p>

        <users-data-table ref="UsersDataTable" />
      </v-card-text>
    </v-card>
  </v-container>
  -->
</template>

<script>
import UsersDataTable from '@/components/admin/users/UsersDataTable.vue'

export default {
  name: 'Index',

  layout: 'admin',

  components: {
    UsersDataTable
  },

  data () {
    return {}
  },

  mounted () {
    this.$refs.UsersDataTable.refresh()
  }
}
</script>
