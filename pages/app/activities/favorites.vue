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
import TopBar from '@/components/app/activities/TopBar.vue'
import ActivityResults from '@/components/app/activities/ActivityResults.vue'
import ActivityTitle from '@/components/app/activities/ActivityTitle.vue'

export default {
  name: 'Favorites',

  components: {
    ActivityPlayer,
    ActivityResults,
    ActivityTitle,
    TopBar
  },

  data: () => {
    return {
      activities: []
    }
  },

  computed: {
    ...mapGetters({ children: 'getCurrentChild' })
  },

  created () {
    const promises = []

    this.children.forEach((child) => {
      promises.push(this.getFavorites({ childrenId: child.id }))
    })

    Promise.all(promises).then((results) => {
      const ids = []
      results.forEach((result) => {
        result.forEach((row) => {
          ids.push(row.id)
        })
      })

      ids.forEach((id) => {
        this.getActivityById(id).then((activity) => {
          this.activities.push(activity)
        })
      })
    })
  },

  methods: {
    ...mapActions('admin/activity', ['getActivityById']),
    ...mapActions('video', ['getFavorites'])
  }
}
</script>
