<template>
  <notification-data-table />
</template>

<script>
import NotificationDataTable from '@/components/admin/notifications/NotificationDataTable.vue'

export default {
  name: 'NotificationManagement',

  layout: 'admin',

  components: {
    NotificationDataTable
  }
}
</script>
