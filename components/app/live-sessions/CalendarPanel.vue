<template>
  <div class="fill-height d-flex flex-column justify-space-between">
    <v-btn
      class="lsess-calendar-btn text-none font-weight-bold flex-shrink-1 flex-grow-0 d-flex align-center mb-6"
      color="white"
      block
      solo
      x-large
      @click="$emit('mode-change')"
    >
      <img class="mr-3" src="@/assets/svg/sessions-camera.svg">
      <span>Live Sessions Schedule</span>
    </v-btn>

    <div class="flex-shrink-0 flex-grow-1">
      <v-card class="fill-height">
        <v-row class="flex-column" align="center">
          <div class="lsess-title mb-5 mt-6 text-center">
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
}
</style>
