<template>
  <specialists-data-table ref="Specialists" />
</template>

<script>
import SpecialistsDataTable from '@/components/admin/specialists/SpecialistsDataTable.vue'

export default {
  name: 'SpecialistsManagement',

  layout: 'admin',

  components: {
    SpecialistsDataTable
  },

  data () {
    return {}
  },

  mounted () {
    this.$refs.Specialists.refresh()
  }
}
</script>
