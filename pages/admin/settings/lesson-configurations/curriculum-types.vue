<template>
  <curriculum-types-data-table />
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
  }
}
</script>
