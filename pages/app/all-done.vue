<template>
  <v-row class="pt-12 pb-16">
    <v-col cols="4">
      <center>
        <v-img :src="require('@/assets/svg/all-done.svg')" class="ml-4 mt-4" />
      </center>
    </v-col>
    <v-col cols="8" class="pl-3">
      <underlined-title class="text-h6 text-md-h5" text="Congratulations! You have finished all the Daily Lessons!" />

      <p class="text-progress mt-4 pb-3 font-weight-normal">
        You are such a fast learner!
      </p>

      <p>
        Our teachers are constantly developing new lessons and we will keep uploading them to the Daily Lesson plan as they become available.
      </p>

      <p>
        Children love repetition. The more they do a lesson, the better they will absorb its content and the more they will enjoy the experience - they love the feeling of knowing what is going to happen.
      </p>

      <p class="font-weight-bold">
        Choose a Letter to Rewatch:
      </p>
      <v-btn
        color="accent"
        :small="$vuetify.breakpoint.xs"
        @click.stop="goToLessons"
      >
        GO TO LIBRARY
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'AllDone',

  components: {},

  props: {},

  computed: {},

  watch: {},

  created () {},

  methods: {}
}
</script>

<style lang="scss" scoped>

.progress-title {
  color: var(--v-accent-base) !important;
}

</style>
