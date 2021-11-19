<template>
  <patch-data-table />
</template>

<script>
import PatchDataTable from '@/components/admin/patches/PatchDataTable.vue'

export default {
  name: 'PatchManagement',

  layout: 'admin',

  components: {
    PatchDataTable
  }
}
</script>
