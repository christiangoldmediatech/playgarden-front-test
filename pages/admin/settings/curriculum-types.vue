<template>
  <curriculum-types-data-table ref="CurriculumDataTable" />
</template>

<script>
import CurriculumTypesDataTable from '@/components/admin/curriculum/CurriculumTypesDataTable.vue'

export default {
  name: 'CurriculumTypes',

  layout: 'admin',

  components: {
    CurriculumTypesDataTable
  },

  data () {
    return {}
  },

  mounted () {
    this.$refs.CurriculumDataTable.refresh()
  }
}
</script>
