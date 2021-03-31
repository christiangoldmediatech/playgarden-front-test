<template>
  <main-panel />
</template>

<script>
import MainPanel from '@/components/admin/dashboard/MainPanel.vue'

export default {
  name: 'Dashboard',

  layout: 'admin',

  components: {
    MainPanel
  },

  data () {
    return {}
  }
}
</script>
