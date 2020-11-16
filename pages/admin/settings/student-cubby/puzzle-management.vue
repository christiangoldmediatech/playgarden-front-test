<template>
  <puzzle-data-table ref="PuzzleDataTable" />
</template>

<script>
import PuzzleDataTable from '@/components/admin/puzzles/PuzzleDataTable.vue'

export default {
  name: 'PuzzleManagement',

  layout: 'admin',

  components: {
    PuzzleDataTable
  },

  mounted () {
    this.$refs.PuzzleDataTable.refresh()
  }
}
</script>
