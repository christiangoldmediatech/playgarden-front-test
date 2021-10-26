<template>
  <activity-type-data-table />
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
  }
}
</script>
