<template>
  <v-row class="mx-0">
    <v-col cols="12" class="px-5">
      <div class="lsess-date">
        Today 11:00 am.
      </div>
      <v-card class="lsess-card lsess-card-active">
        <img class="active-camera" src="/svg/sessions-active-camera.svg">
        <v-row class="mx-0">
          <v-col class="flex-grow-0 flex-shrink-1">
            <img class="lsess-activity-type" src="/svg/activityType.svg">
          </v-col>
          <v-col>
            <div class="d-flex flex-column justify-space-between fill-height">
              <div class="lsess-card-title">
                Music
              </div>
              <div class="lsess-card-subtitle">
                Emma and Skylar
              </div>
            </div>
          </v-col>
        </v-row>
        <v-row class="mx-0">
          <v-col class="pt-0">
            Description activity here, child learning about maths, and other stuff. Miss Ally will be happy to see you. Thanks for join us.
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'TodayCards'
}
</script>

<style lang="scss">
.lsess {
  &-date {
    text-align: right;
    font-size: 17px;
    margin-bottom: 10px;
  }
  &-card {
    &-activity-type {
      max-width: 60px;
      max-height: 60px;
    }
    &-active.v-card {
      border: solid 3px #F89838;
      .active-camera {
        position: absolute;
        width: 44px;
        height: 44px;
        top: calc(50% - 22px);
        left: calc(100% - 22px);
      }
    }
    &-title {
      font-size: 1.25rem;
      font-weight: bold;
      line-height: 1.13;
    }
    &-subtitle {
      font-size: 1.25rem;
      font-weight: 500;
      line-height: 1.5;
      color: #707070;
    }
  }
}
</style>
