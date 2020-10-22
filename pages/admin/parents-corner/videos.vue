<template>
  <v-container>
    <parents-corner-video-editor ref="editor" @saved="update" />

    <admin-content-header
      title="Parent's Corner Videos"
      description="View, create, update, or delete parent corner videos."
      create-button-text="Add new video"
      :xs="$vuetify.breakpoint.xs"
      @open-editor="openEditor(null)"
    />

    <parents-corner-videos-data-table
      ref="table"
      @open-editor="openEditor"
    />
  </v-container>
</template>

<script>
export default {
  name: 'Videos',

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
