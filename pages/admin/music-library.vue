<template>
  <music-library-data-table />
</template>

<script>
import MusicLibraryDataTable from '@/components/admin/music-library/MusicLibraryDataTable'

export default {
  name: 'MusicLibrary',
  layout: 'admin',
  components: {
    MusicLibraryDataTable
  }
}
</script>
