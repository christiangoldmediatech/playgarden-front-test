<template>
  <kids-corner-videos-editor />
</template>

<script>
import { defineComponent } from '@vue/composition-api'
import KidsCornerVideosEditor from '@/components/admin/kids-corner-videos/KidsCornerVideosEditor.vue'

export default defineComponent({
  name: 'Editor',

  layout: 'admin',

  components: {
    KidsCornerVideosEditor
  }
})
</script>
