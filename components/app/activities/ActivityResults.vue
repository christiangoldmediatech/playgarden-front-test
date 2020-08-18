<template>
  <v-container>
    <v-row>
      <activity-card
        v-for="activity in activities"
        :key="`search-activity-${activity.id}`"
        :activity-id="activity.id"
        :activity="activity.videos"
        :icon="activity.activityType.icon"
        :category-name="activity.activityType.name"
      />
    </v-row>

    <v-row justify="center">
      <v-col cols="12" sm="10" md="8" lg="6" xl="4">
        <v-btn
          color="primary"
          text
          block
          x-large
          @click.stop="$router.push({ name: 'app-activities' })"
        >
          Return to activities
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ActivityCard from './ActivityCard.vue'

export default {
  name: 'ActivityResults',

  components: {
    ActivityCard
  },

  props: {
    activities: {
      type: Array,
      required: true
    }
  },

  data: () => {
    return {}
  }
}
</script>
