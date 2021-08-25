<template>
  <playdates-data-table />
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import PlaydatesDataTable from '~/components/admin/playdates/PlaydatesDataTable.vue'

export default defineComponent({
  name: 'Index',

  layout: 'admin',

  components: {
    PlaydatesDataTable
  }
})
</script>
