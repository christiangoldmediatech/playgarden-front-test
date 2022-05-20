<template>
  <v-card>
    <slot />

    <v-img
      :src="require('@/assets/jpg/worksheets_completed_2.jpg')"
      class="pa-3"
      gradient="to bottom, #272727, rgba(255, 255, 255, 0) 78.73%"
      height="100%"
    >
      <div
        class="pos-relative d-flex flex-column fill-height justify-space-around align-center"
      >
        <v-btn
          v-if="showReturn"
          class="pos-absolute pos-top-0 pos-right-0 mt-n4 mr-n4"
          text
          icon
          @click="close"
        >
          <v-icon color="white">
            mdi-close
          </v-icon>
        </v-btn>
        <div class="text-center">
          <underlined-title class="white--text underlined-title-dark-green">
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
            class="mb-5"
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

          <v-btn
            v-if="showReturn"
            class="mb-5"
            color="accent"
            dark
            x-large
            :disabled="loadingNext"
            @click="close"
          >
            RETURN TO LESSON
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

  props: {
    showReturn: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  computed: {
    ...mapGetters('admin/curriculum', { lesson: 'getLesson' }),
    ...mapGetters({ children: 'getCurrentChild' }),

    childId() {
      return this.children[0].id
    }
  },

  methods: {
    goToLibrary() {
      this.$router.push({
        name: 'app-library'
      })
    },

    close() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.return-btn.v-btn {
  font-size: 24px;
  font-weight: bold;
  letter-spacing: 0.04em;
  line-height: 1.46;
  @media screen and (max-width: 599px) {
    font-size: 18px;
  }
}
</style>
