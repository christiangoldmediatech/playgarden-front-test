<template>
  <v-container>
    <v-card>
      <v-toolbar
        color="accent darken-1"
        dark
        flat
      >
        <v-toolbar-title>
          Activity Types
        </v-toolbar-title>
      </v-toolbar>

      <v-card-text>
        <p>Add, create, update, or delete an activity type.</p>

        <activity-type-data-table ref="ActivityTypeDataTable" />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import ActivityTypeDataTable from '@/components/admin/activity/ActivityTypeDataTable.vue'

export default {
  name: 'ActivityTypes',

  layout: 'admin',

  components: {
    ActivityTypeDataTable
  },

  data () {
    return {}
  },

  mounted () {
    this.$refs.ActivityTypeDataTable.refresh()
  }
}
</script>
