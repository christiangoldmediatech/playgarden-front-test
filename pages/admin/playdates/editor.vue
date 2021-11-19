<template>
  <playdates-editor />
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import PlaydatesEditor from '~/components/admin/playdates/PlaydatesEditor.vue'

export default defineComponent({
  name: 'Editor',

  layout: 'admin',

  components: {
    PlaydatesEditor
  }
})
</script>
