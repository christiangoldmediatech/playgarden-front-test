<template>
  <v-container>
    <v-card>
      <v-toolbar
        color="accent darken-1"
        dark
        flat
      >
        <v-toolbar-title>
          Curriculum Types
        </v-toolbar-title>
      </v-toolbar>

      <v-card-text>
        <p>Add, create, update, or delete a curriculum type.</p>

        <curriculum-data-table ref="CurriculumDataTable" />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import CurriculumDataTable from '@/components/admin/curriculum/CurriculumDataTable.vue'

export default {
  name: 'CurriculumTypes',

  layout: 'admin',

  components: {
    CurriculumDataTable
  },

  data () {
    return {}
  },

  mounted () {
    this.$refs.CurriculumDataTable.refresh()
  }
}
</script>
