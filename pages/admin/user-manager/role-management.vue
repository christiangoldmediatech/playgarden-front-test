<template>
  <roles-data-table />
</template>

<script>
import RolesDataTable from '@/components/admin/roles/RolesDataTable.vue'

export default {
  name: 'RoleManagement',

  layout: 'admin',

  components: {
    RolesDataTable
  }
}
</script>
