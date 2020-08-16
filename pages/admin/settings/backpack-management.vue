<template>
  <backpack-data-table ref="BackpackDataTable" />
</template>

<script>
import BackpackDataTable from '@/components/admin/backpacks/BackpackDataTable.vue'

export default {
  name: 'BackpackManagement',

  layout: 'admin',

  components: {
    BackpackDataTable
  },

  data () {
    return {}
  },

  mounted () {
    this.$refs.BackpackDataTable.refresh()
  }
}
</script>
