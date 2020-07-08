<template>
  <v-container>
    <v-card>
      <v-card-title>
        Curriculum Types
      </v-card-title>

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
  layout: 'admin',

  middleware: ['authRedirect'],

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
