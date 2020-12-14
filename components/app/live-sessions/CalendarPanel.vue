<template>
  <div class="fill-height d-flex flex-column">
    <v-btn
      class="lsess-calendar-btn text-none font-weight-bold flex-shrink-1 flex-grow-0 d-flex align-center mb-3 mb-md-6"
      color="white"
      block
      solo
      x-large
      @click="$emit('mode-change')"
    >
      <img class="mr-3" src="@/assets/svg/sessions-camera.svg">
      <span>Live Class Schedule</span>
    </v-btn>

    <div>
      <v-card class="lsess-calendar-card">
        <v-row class="flex-column" align="center">
          <div class="lsess-title mb-3 mb-md-5 mt-3 mt-md-6 text-center">
            Calendar
          </div>
          <v-date-picker class="lsess-date-picker" :value="value" @change="$emit('input', $event)" />
        </v-row>
      </v-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CalendarPanel',

  props: {
    value: {
      type: [Object, String],
      required: true
    }
  }
}
</script>

<style lang="scss">
.lsess {
  &-date-picker {
    .v-picker__title {
      display: none;
    }
    .v-date-picker-table tr td {
      padding-top: 8px;
      padding-bottom: 8px;
    }
    div.v-date-picker-table {
      height: auto;
    }
  }
  &-calendar-card {
    height: auto;
    max-height: 100%;
    padding-bottom: 20px;
  }
}
</style>
