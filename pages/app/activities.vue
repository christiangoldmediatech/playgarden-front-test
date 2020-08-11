<template>
  <v-main>
    <v-container>
      <v-row align="center">
        <v-btn
          class="text-none mx-3"
          color="white"
          x-large
        >
          Favorites
          <v-icon class="ml-2" color="#F5737F">
            mdi-heart
          </v-icon>
        </v-btn>

        <v-spacer />

        <v-col cols="12" sm="4" xl="3">
          <v-text-field
            placeholder="Search"
            append-icon="mdi-magnify"
            clearable
            hide-details
            solo
          />
        </v-col>
      </v-row>

      <v-row justify="center">
        <v-col class="text-center" cols="12" lg="9">
          <p class="text-h3">
            <span class="title-text">
              Master subjects to collect patches for your Student Cubby!
            </span>
          </p>
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
import ActivityPlayer from '@/components/app/activities/ActivityPlayer'
import Carousel from '@/components/app/activities/Carousel'
import CategoryHeader from '@/components/app/activities/CategoryHeader'

export default {
  name: 'Activities',

  components: {
    Carousel,
    CategoryHeader,
    ActivityPlayer
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
    this.getTypes()
    this.getActivities({ type: 'VIDEO', limit: 50 })
  },

  methods: {
    ...mapActions('admin/activity', ['getTypes', 'getActivities'])
  }
}
</script>

<style lang="scss" scoped>
.title-text {
  width: calc(100%);
  background-image: linear-gradient(transparent calc(100% - 10px), var(--v-primary-base) 10px);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  color: var(--v-black-base);
}

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
