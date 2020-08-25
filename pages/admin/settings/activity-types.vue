<template>
  <activity-type-data-table ref="ActivityTypeDataTable" />
</template>

<script>
import ActivityTypeDataTable from '@/components/admin/activity/ActivityTypeDataTable.vue'

export default {
  name: 'ActivityTypes',

  layout: 'admin',

  components: {
    ActivityTypeDataTable
  },

  data () {
    return {}
  },

  mounted () {
    this.$refs.ActivityTypeDataTable.refresh()
  }
}
</script>
