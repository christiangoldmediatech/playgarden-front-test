<template>
  <shipping-address-data-table ref="ShippingAddressDataTable" />
</template>

<script>
import { mapActions } from 'vuex'
import ShippingAddressDataTable from '~/components/admin/shipping-address/ShippingAddressDataTable.vue'

export default {
  name: 'Index',

  layout: 'admin',

  components: {
    ShippingAddressDataTable
  },

  data () {
    return {
      placeholder: false
    }
  },

  created () {
    this.getTypes({ extra: true })
  },

  mounted () {
    this.$refs.ShippingAddressDataTable.refresh()
  },

  methods: {
    ...mapActions('admin/activity', ['getTypes'])
  }
}
</script>
