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
export default {
  name: 'Categories',

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
