<template>
  <v-main>
    <v-container class="pb-0">
      <top-bar />
      <activity-title />
    </v-container>

    <v-container class="hidden-md-and-down">
      <v-row justify="center">
        <v-col class="text-center font-weight-bold text-h5 py-0" cols="12">
          Browse by category
        </v-col>
      </v-row>
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
    <activity-player />
  </v-main>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import TopBar from '@/components/app/activities/TopBar.vue'
import ActivityPlayer from '@/components/app/activities/ActivityPlayer.vue'
import ActivityTitle from '@/components/app/activities/ActivityTitle.vue'
import Carousel from '@/components/app/activities/Carousel.vue'
import CategoryHeader from '@/components/app/activities/CategoryHeader.vue'

export default {
  name: 'Index',

  components: {
    TopBar,
    Carousel,
    CategoryHeader,
    ActivityPlayer,
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
    this.getTypes({ extra: true })
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
