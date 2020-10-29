<template>
  <live-session-data-table ref="LiveSessionDataTable" />
</template>

<script>
import LiveSessionDataTable from '@/components/admin/live-sessions/LiveSessionDataTable'

export default {
  name: 'LiveSessionManagement',

  layout: 'admin',

  components: {
    LiveSessionDataTable
  },

  mounted () {
    this.$refs.LiveSessionDataTable.refresh()
  }
}
</script>
