<template>
  <coupon-data-table />
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
  }
}
</script>
