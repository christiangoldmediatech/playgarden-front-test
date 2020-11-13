<template>
  <v-container>
    <parents-corner-category-editor ref="editor" @saved="update" />

    <admin-content-header
      title="Parent's Corner Categories"
      description="View, create, update, or delete parent corner categories."
      create-button-text="Add new category"
      :xs="$vuetify.breakpoint.xs"
      @open-editor="openEditor(null)"
    />

    <parents-corner-categories-data-table
      ref="table"
      @open-editor="openEditor"
    />
  </v-container>
</template>

<script>
import ParentsCornerCategoryEditor from '@/components/admin/parents-corner/ParentsCornerCategoryEditor.vue'
import ParentsCornerCategoriesDataTable from '@/components/admin/parents-corner/ParentsCornerCategoriesDataTable.vue'
import AdminContentHeader from '@/components/admin/AdminContentHeader.vue'

export default {
  name: 'ParentsCornerCategories',

  components: {
    ParentsCornerCategoriesDataTable,
    ParentsCornerCategoryEditor,
    AdminContentHeader
  },

  layout: 'admin',

  methods: {
    openEditor (item) {
      this.$refs.editor.open(item)
    },

    update () {
      this.$refs.table.refresh(false)
    }
  }
}
</script>
