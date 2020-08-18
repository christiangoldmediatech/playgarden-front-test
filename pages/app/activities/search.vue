<template>
  <v-main>
    <v-container>
      <top-bar />
      <activity-title />
    </v-container>
    <activity-results v-bind="{ activities }" />
    <activity-player />
  </v-main>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ActivityPlayer from '@/components/app/activities/ActivityPlayer.vue'
import ActivityResults from '@/components/app/activities/ActivityResults.vue'
import ActivityTitle from '@/components/app/activities/ActivityTitle.vue'
import TopBar from '@/components/app/activities/TopBar.vue'

export default {
  name: 'Search',

  components: {
    ActivityPlayer,
    ActivityResults,
    ActivityTitle,
    TopBar
  },

  data: () => {
    return {}
  },

  computed: {
    ...mapGetters('admin/activity', { activities: 'rows' }),

    query () {
      return this.$route.query.q
    }
  },

  watch: {
    query () {
      this.refresh()
    }
  },

  created () {
    this.refresh()
  },

  methods: {
    ...mapActions('admin/activity', ['getActivities']),

    refresh () {
      this.getActivities({ type: 'VIDEO', limit: 50, name: this.query })
    }
  }
}
</script>
