<template>
  <users-data-table />
</template>

<script>
import UsersDataTable from '@/components/admin/users/UsersDataTable.vue'

export default {
  name: 'Index',

  layout: 'admin',

  components: {
    UsersDataTable
  }
}
</script>
