<template>
  <activity-data-table ref="ActivityDataTable" />
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
    this.getTypes()
  },

  mounted () {
    this.$refs.ActivityDataTable.refresh()
  },

  methods: {
    ...mapActions('admin/activity', ['getTypes'])
  }
}
</script>
