<template>
  <parents-data-table ref="Specialists" />
</template>

<script>
import ParentsDataTable from '@/components/admin/parents/ParentsDataTable.vue'

export default {
  name: 'ParentsList',

  layout: 'admin',

  components: {
    ParentsDataTable
  },

  data () {
    return {}
  },

  mounted () {
    this.$refs.Specialists.refresh()
  }
}
</script>
