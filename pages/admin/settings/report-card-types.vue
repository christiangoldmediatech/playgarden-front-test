<template>
  <v-container>
    <v-card>
      <v-toolbar
        color="accent darken-1"
        dark
        flat
      >
        <v-toolbar-title>
          Report Card Types
        </v-toolbar-title>
      </v-toolbar>

      <v-card-text>
        <p>View, create, update, or delete an report card types.</p>

        <report-card-types-data-table ref="ReportCardTypesDataTable" />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import ReportCardTypesDataTable from '@/components/admin/report-card/ReportCardTypesDataTable.vue'

export default {
  name: 'ReportCardTypes',

  layout: 'admin',

  components: {
    ReportCardTypesDataTable
  },

  data () {
    return {}
  },

  mounted () {
    this.$refs.ReportCardTypesDataTable.refresh()
  }
}
</script>
