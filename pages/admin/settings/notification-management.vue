<template>
  <notification-data-table ref="NotificationDataTable" />
</template>

<script>
import NotificationDataTable from '@/components/admin/notifications/NotificationDataTable.vue'

export default {
  name: 'NotificationManagement',

  layout: 'admin',

  components: {
    NotificationDataTable
  },

  data () {
    return {}
  },

  mounted () {
    this.$refs.NotificationDataTable.refresh()
  }
}
</script>
