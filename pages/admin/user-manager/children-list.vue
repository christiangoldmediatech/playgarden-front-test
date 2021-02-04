<template>
  <children-data-table ref="children" />
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

  mounted () {
    this.$refs.children.refresh()
  },
  methods: {
    ...mapActions('admin/children', ['getChildrensProgress'])
  }
}
</script>
