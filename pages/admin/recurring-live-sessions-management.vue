<template>
  <recurring-live-session-data-table ref="RecurringLiveSessionDataTable" />
</template>

<script>
import RecurringLiveSessionDataTable from '@/components/admin/recurring-live-sessions/RecurringLiveSessionDataTable'

export default {
  name: 'RecurringLiveSessionsManagement',

  layout: 'admin',

  components: {
    RecurringLiveSessionDataTable
  },

  mounted () {
    this.$refs.RecurringLiveSessionDataTable.refresh()
  }
}
</script>
