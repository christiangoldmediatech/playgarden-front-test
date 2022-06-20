<template>
  <div>
    <virtual-preschool-child v-if="!hasUserLearnAndPlayPlan" />
    <virtual-learn-and-play v-else />
  </div>
</template>

<script>
import VirtualPreschoolChild from '@/components/app/virtual-preschool/VirtualPreschool.vue'
import VirtualLearnAndPlay from '@/components/app/virtual-preschool/VirtualLearnAndPlay.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'VirtualPreschool',

  layout: 'pg',

  components: {
    VirtualPreschoolChild,
    VirtualLearnAndPlay
  },

  computed: {
    ...mapGetters('auth', {
      hasUserLearnAndPlayPlan: 'hasUserLearnAndPlayPlan'
    })
  }
}
</script>

<style>

</style>
