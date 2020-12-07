<template>
  <agenda-data-table ref="AgendaDataTable" />
</template>

<script>
import { mapActions } from 'vuex'
import AgendaDataTable from '@/components/admin/agenda/AgendaDataTable.vue'

export default {
  name: 'Index',

  layout: 'admin',

  components: {
    AgendaDataTable
  },

  data () {
    return {
      placeholder: false
    }
  },

  created () {
    this.getTypes()
  },

  mounted () {
    this.$refs.AgendaDataTable.refresh()
  },

  methods: {
    ...mapActions('admin/activity', ['getTypes'])
  }
}
</script>
