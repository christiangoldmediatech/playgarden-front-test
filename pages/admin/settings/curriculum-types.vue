<template>
  <curriculum-types-data-table ref="CurriculumDataTable" />
  <!--
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
        <p>View, create, update, or delete a curriculum types.</p>

        <curriculum-types-data-table ref="CurriculumDataTable" />
      </v-card-text>
    </v-card>
  </v-container>
  -->
</template>

<script>
import CurriculumTypesDataTable from '@/components/admin/curriculum/CurriculumTypesDataTable.vue'

export default {
  name: 'CurriculumTypes',

  layout: 'admin',

  components: {
    CurriculumTypesDataTable
  },

  data () {
    return {}
  },

  mounted () {
    this.$refs.CurriculumDataTable.refresh()
  }
}
</script>
