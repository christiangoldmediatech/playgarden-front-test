<template>
  <div>
    <parent-edit-form />
  </div>
</template>

<script lang="ts">
import ParentEditForm from '@/components/admin/parents/ParentEditForm.vue'
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'Editor',
  layout: 'admin',
  components: {
    ParentEditForm
  }
})
</script>
