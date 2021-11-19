<template>
  <agenda-data-table />
</template>

<script>
import { mapActions } from 'vuex'
import AgendaDataTable from '@/components/admin/playdates/AgendaPlaydateDataTable.vue'

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
    this.getTypes({ extra: true })
  },
  methods: {
    ...mapActions('admin/activity', ['getTypes'])
  }
}
</script>
