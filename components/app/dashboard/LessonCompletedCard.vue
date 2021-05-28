<template>
  <v-card>
    <slot />

    <v-img
      :src="require('@/assets/jpg/worksheets_completed_2.jpg')"
      class="pa-3"
      gradient="to bottom, #272727, rgba(255, 255, 255, 0) 78.73%"
      height="100%"
    >
      <div class="d-flex flex-column fill-height justify-space-around align-center">
        <div class="text-center">
          <underlined-title
            class="white--text"
          >
            Congratulations!
          </underlined-title>

          <p class="white--text text-h5">
            You have completed all the tasks for the day.<br>
            Come back tomorrow for more.
          </p>
        </div>

        <div class="d-flex flex-column mb-8">
          <v-btn
            class="mb-5"
            color="accent"
            :loading="loadingNext"
            x-large
            @click="advance"
          >
            <v-icon large class="mr-3">
              mdi-arrow-right
            </v-icon>
            GO TO NEXT DAY
          </v-btn>

          <v-btn
            color="#FEC572"
            dark
            x-large
            :disabled="loadingNext"
            @click="goToLibrary"
          >
            <v-icon large class="mr-3">
              mdi-play
            </v-icon>
            GO TO LIBRARY
          </v-btn>
        </div>
      </div>
    </v-img>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import LessonAdvanceMixin from '@/mixins/LessonAdvanceMixin'

export default {
  name: 'LessonCompletedCard',

  mixins: [LessonAdvanceMixin],

  computed: {
    ...mapGetters('admin/curriculum', { lesson: 'getLesson' }),
    ...mapGetters({ children: 'getCurrentChild' }),

    childId () {
      return this.children[0].id
    }
  },

  methods: {
    goToLibrary () {
      this.$router.push({
        name: 'app-library'
      })
    }
  }
}
</script>
