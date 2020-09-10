<template>
  <div class="d-flex flex-column fill-height">
    <!-- <div class="sticky"> -->
    <v-row class="letter-day-row" justify="center">
      <div class="letter-day-circle white">
        <div class="accent--text font-weight-bold text-center text-h3">
          {{ letter }}
        </div>

        <div
          class="accent--text font-weight-bold text-center text-h5 text-uppercase"
        >
          DAY {{ day }}
        </div>
      </div>
    </v-row>
    <v-card class="d-flex flex-column justify-center flex-grow-1 flex-shrink-0 panel-card">
      <div class="card-border-top" />
      <div class="px-3">
        <div class="font-weight-bold text-center spaced-out">
          <slot />
        </div>
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'BlankDashboardPanel',

  props: {
    letter: {
      type: String,
      required: true
    },

    day: {
      type: [Number, String],
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.letter-day {
  &-row {
    height: 79px;
    max-height: 79px;
  }

  &-circle {
    margin-top: 24px;
    border-radius: 50%;
    box-shadow: #dce7b5 0px 0px 0px 8px, #c2daa5 0px 0px 0px 19px;
    height: 120px;
    padding-top: 20px;
    width: 120px;
    z-index: 1;
  }
}

.card-border-top {
  background-color: #c2daa5;
  border-radius: 4px;
  height: 18px;
  position: absolute;
  top: 0;
  width: 100%;
}

.spaced-out {
  font-size: 24px;
  letter-spacing: 0.150em !important;
}
</style>
