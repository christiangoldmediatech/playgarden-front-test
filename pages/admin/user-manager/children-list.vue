<template>
  <children-data-table />
</template>

<script>
import { mapActions } from 'vuex'
import ChildrenDataTable from '~/components/admin/children/ChildrenDataTable'
export default {
  name: 'ChildrenList',
  layout: 'admin',
  components: {
    ChildrenDataTable
  },
  data () {
    return {}
  },
  created () {
    this.getChildrensProgress()
  },
  methods: {
    ...mapActions('admin/children', ['getChildrensProgress'])
  }
}
</script>
