<template>
  <v-overlay
    class="lesson-completed"
    :value="value"
    :z-index="600"
  >
    <v-card class="lesson-completed-container" light>
      <div class="green-line-bigger green-line-1" />
      <div class="green-line-bigger green-line-2" />

      <div class="lesson-completed-content">
        <pg-inline-video-player />

        <v-row class="mx-0">
          <v-col cols="12">
            <h5 class="my-2 text-h5 font-weight-bold text-center">
              What do you want to do next?
            </h5>
          </v-col>

          <v-col cols="12" sm="6">
            <v-btn color="accent" block>
              <template v-if="$vuetify.breakpoint.mdAndUp">
                UPLOAD COMPLETED WORKSHEET
              </template>
              <template v-else>
                UPLOAD WORKSHEET
              </template>
            </v-btn>
          </v-col>

          <v-col cols="12" sm="6">
            <v-btn class="white--text" color="#FEC572" block>
              SKIP TO ACTIVITIES
            </v-btn>
          </v-col>

          <v-col cols="12">
            <v-btn
              class="dashboard-message-btn"
              color="primary"
              text
              block
              tile
              :disabled="loading"
            >
              Return to dashboard
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </v-card>
  </v-overlay>
</template>

<script>
export default {
  name: 'LessonCompletedDialog',

  props: {
    value: {
      type: Boolean,
      required: true
    }
  }
}
</script>

<style lang="scss">
.lesson-completed {
  & .green-line-1 {
    height: 12px
  }
  & .green-line-2 {
    height: 17px;
  }
  & .v-overlay__content {
    // width: 100vw;
    // height: 100vh;
    // max-height: 100vh;
    // overflow: hidden;
    padding: 12px;
  }
  &-container {
    max-width: 100%;
    max-height: 100%;
    overflow: hidden;
    margin: 0 auto;
    @media screen and (min-width: 600px) {
      max-width: 80%;
    }
    @media screen and (min-width: 1264px) {
      max-width: 60%;
    }
    @media screen and (min-width: 1904px) {
      max-width: 60%;
    }
  }
  &-content {
    max-height: calc(100vh - 53px);
    box-shadow: 0 -1px 6px 0 rgba(0, 0, 0, 0.12);
    overflow-x: hidden;
    overflow-y: auto;
  }
}
</style>
