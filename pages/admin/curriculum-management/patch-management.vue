<template>
  <patch-data-table ref="PatchDataTable" />
</template>

<script>
import PatchDataTable from '@/components/admin/patches/PatchDataTable.vue'

export default {
  name: 'PatchManagement',

  layout: 'admin',

  components: {
    PatchDataTable
  },

  mounted () {
    this.$refs.PatchDataTable.refresh()
  }
}
</script>
