<template>
  <music-library-data-table ref="MusicLibraryDataTable" />
</template>

<script>
import MusicLibraryDataTable from '@/components/admin/music-library/MusicLibraryDataTable'

export default {
  name: 'MusicLibrary',

  layout: 'admin',

  components: {
    MusicLibraryDataTable
  },

  mounted () {
    this.$refs.MusicLibraryDataTable.refresh()
  }
}
</script>
