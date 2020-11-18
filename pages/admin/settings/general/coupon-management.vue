<template>
  <coupon-data-table ref="CouponDataTable" />
</template>

<script>
import CouponDataTable from '@/components/admin/coupons/CouponDataTable.vue'

export default {
  name: 'CouponManagement',

  layout: 'admin',

  components: {
    CouponDataTable
  },

  data () {
    return {}
  },

  mounted () {
    this.$refs.CouponDataTable.refresh()
  }
}
</script>
