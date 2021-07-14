<template>
  <v-row align-content="center" justify="center">
    <v-col v-for="section in sections" :key="section.title" cols="12" md="4">
      <v-img
        :src="section.imageUrl"
        gradient="rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15)"
        class="section"
        contain
        @click="$router.push({ name: section.routeName })"
      >
        <div class="section-btn">
          <div>{{ section.title }}</div>
        </div>
      </v-img>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  layout: 'pg',

  setup () {
    const sections = [
      {
        imageUrl: require('@/assets/png/virtual-preschool/Daily lessons.png'),
        title: 'Daily Lessons',
        routeName: 'app-daily-lessons'
      },
      {
        imageUrl: require('@/assets/png/virtual-preschool/playdates.png'),
        title: 'Playdates',
        routeName: 'app-playdates'
      },
      {
        imageUrl: require('@/assets/png/virtual-preschool/live classes.png'),
        title: 'Live Classes',
        routeName: 'app-live-classes'
      },
      {
        imageUrl: require('@/assets/png/virtual-preschool/Cubby.png'),
        title: 'Student Cubby',
        routeName: 'app-student-cubby'
      },
      {
        imageUrl: require('@/assets/png/virtual-preschool/Music.png'),
        title: 'Music',
        routeName: 'app-music'
      },
      {
        imageUrl: require('@/assets/png/virtual-preschool/Library.png'),
        title: 'Library',
        routeName: 'app-library'
      }
    ]

    return {
      sections
    }
  }
})
</script>

<style lang="scss" scoped>
.section {
  cursor: pointer;
}

.section-btn {
  position: absolute;
  bottom: 10px;
  left: 10px;

  background: rgba(178, 230, 141, 0.2);
  border: 4px solid #B2E68D;
  box-sizing: border-box;
  border-radius: 8px;
  cursor: pointer;

  & div {
    color: white;
    font-size: 18px;
    font-weight: bold;
    text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

    padding-top: 4px;
    padding-bottom: 4px;
    padding-left: 12px;
    padding-right: 12px;
  }
}
</style>
