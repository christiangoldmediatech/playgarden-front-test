<template>
  <puzzle-data-table />
</template>

<script>
import PuzzleDataTable from '@/components/admin/puzzles/PuzzleDataTable.vue'

export default {
  name: 'PuzzleManagement',
  layout: 'admin',
  components: {
    PuzzleDataTable
  }
}
</script>
