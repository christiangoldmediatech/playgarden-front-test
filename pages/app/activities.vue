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
        <v-col class="text-center" cols="12" md="8" lg="6">
          <p class="text-h3">
            <span class="title-text">
              Activities to engage curious minds!
            </span>
          </p>
        </v-col>
        <v-col class="text-center text-h5" cols="12">
          Browse by category
        </v-col>
      </v-row>

      <v-row align="center" justify="center">
        <div
          v-for="category in categories"
          :key="`category-${category.id}`"
          class="clickable text-center mx-2"
          @click="$scrollTo(`#category_row_${category.id}`, 500, { offset: -60 })"
        >
          <div
            class="category d-flex justify-center align-center"
            :style="{'--bgColor': category.color}"
          >
            <img
              :src="category.icon"
              height="60px"
            >
          </div>
          <span
            class="font-weight-bold text-uppercase category-text"
            :style="{'--bgColor': category.color}"
          >
            {{ category.name }}
          </span>
        </div>
      </v-row>
    </v-container>

    <carousel
      v-for="category in categories"
      :id="`category_row_${category.id}`"
      :key="`category-playlist-${category.id}`"
      :category-name="category.name"
      :color="category.color"
      :icon="category.icon"
      :activities="playlist(category.id)"
    />
  </v-main>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Carousel from '@/components/app/activities/Carousel'

export default {
  name: 'Activities',

  components: {
    Carousel
  },

  data: () => {
    return {

    }
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
    this.getActivities({ type: 'VIDEO' })
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

.category {
  width: 103px;
  height: 103px;
  border: solid 6px var(--bgColor);
  border-radius: 50%;
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
