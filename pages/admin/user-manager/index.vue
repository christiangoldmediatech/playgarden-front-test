<template>
  <users-data-table ref="UsersDataTable" />
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
