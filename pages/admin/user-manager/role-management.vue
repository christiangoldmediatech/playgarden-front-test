<template>
  <roles-data-table ref="RolesDataTable" />
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
