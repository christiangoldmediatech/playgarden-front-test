<template>
  <div class="music-player">
    <div class="child-selector ml-auto">
      <child-select v-model="selectedChildId" hide-details />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import ChildSelect from '@/components/app/ChildSelect.vue'

export default {
  name: 'MusicPlayer',
  components: {
    ChildSelect
  },
  data () {
    return {
      selectedChildId: null
    }
  },
  computed: {
    ...mapGetters({ currentChild: 'getCurrentChild' }),
    id () {
      return this.$route.query.id ? parseInt(this.$route.query.id) : null
    },
    playerWidth () {
      if (this.playerShowing) {
        return '450'
      } else {
        return 0
      }
    }
  },
  watch: {
    selectedChildId (id) {
      if (id) {
        this.$router.push({ name: this.$route.name, query: { id } })
      }
    }
  },
  created () {
    if (this.id) {
      this.selectedChildId = parseInt(this.id)
    } else if (this.currentChild.length) {
      this.selectedChildId = this.currentChild[0].id
    }
  }
}
</script>

<style lang="scss" scoped>
.music-player {
  height: 100%;
  .child-selector {
    max-width: 250px;
  }
}
</style>
