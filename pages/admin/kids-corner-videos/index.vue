<template>
  <kids-corner-videos-data-table ref="KidsCornerVideosDataTable" />
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import KidsCornerVideosDataTable from '@/components/admin/kids-corner-videos/KidsCornerVideosDataTable.vue'

export default defineComponent({
  name: 'Index',

  layout: 'admin',

  components: {
    KidsCornerVideosDataTable
  },

  mounted () {
    // this.$refs.KidsCornerVideosDataTable.refresh()
  }
})
</script>
