<template>
  <backpack-data-table />
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
  }
}
</script>
