<template>
  <activity-data-table />
</template>

<script>
import { mapActions } from 'vuex'
import ActivityDataTable from '@/components/admin/activity/ActivityDataTable.vue'

export default {
  name: 'Index',

  layout: 'admin',

  components: {
    ActivityDataTable
  },

  data () {
    return {
      placeholder: false
    }
  },

  created () {
    this.getTypes({ activity: true })
  },
  methods: {
    ...mapActions('admin/activity', ['getTypes'])
  }
}
</script>
