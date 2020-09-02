<template>
  <v-main>
    <v-container>
      <top-bar />
      <activity-title />
    </v-container>

    <category-header v-bind="{ categories }" />

    <carousel
      v-for="category in categories"
      :id="`category_row_${category.id}`"
      :key="`category-playlist-${category.id}`"
      :category-name="category.name"
      :color="category.color"
      :icon="category.icon"
      :activities="playlist(category.id)"
    />
    <lesson-activity-player />
  </v-main>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import LessonActivityPlayer from '@/components/app/dashboard/LessonActivityPlayer.vue'
import ActivityTitle from '@/components/app/activities/ActivityTitle.vue'
import Carousel from '@/components/app/activities/Carousel.vue'
import CategoryHeader from '@/components/app/activities/CategoryHeader.vue'

export default {
  name: 'Index',

  components: {
    Carousel,
    CategoryHeader,
    LessonActivityPlayer,
    ActivityTitle
  },

  data: () => {
    return {}
  },

  computed: {
    ...mapGetters('admin/activity', {
      types: 'types',
      activities: 'rows'
    }),

    categories () {
      return this.types.filter(item => item.icon && item.icon !== '0' && this.playlist(item.id).length)
    },

    playlist () {
      return (activityTypeId) => {
        return this.activities.filter(activity => activity.activityType.id === activityTypeId)
      }
    }
  },

  created () {
    this.getAllFavorites()
    this.getTypes()
    this.getActivities({ status: 'COMPLETED', type: 'VIDEO', limit: 50 })
  },

  methods: {
    ...mapActions('admin/activity', ['getTypes', 'getActivities']),
    ...mapActions('video', ['getAllFavorites'])
  }
}
</script>

<style lang="scss" scoped>
.category-text {
  position: relative;
  z-index: 1;
  color: var(--v-black-base);
  &::after {
    width: 115%;
    opacity: 0.5;
    position: absolute;
    bottom: 0%;
    left: -7.5%;
    content: "";
    z-index: -1;
    border-bottom: 11px solid var(--bgColor);
    border-radius: 7px;
  }
}
</style>
