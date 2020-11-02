<template>
  <div class="lsess-table">
    <div class="pl-16 pr-8">
      <v-row>
        <v-col v-for="(day, index) in days" :key="`days-row-column-${index}`" class="lsess-table-col lsess-table-col-header">
          {{ day }}

          <div v-if="index === activeDay" class="lsess-table-col-header-active" />
        </v-col>
      </v-row>
    </div>

    <perfect-scrollbar>
      <div v-for="hour in 16" :key="`hour-${hour}`" class="lsess-table-hour-row">
        <div class="d-flex align-center justify-center lsess-table-offset">
          {{ 7 + hour }}:00
        </div>
        <v-row>
          <v-col
            v-for="(day, dayIndex) in days"
            :key="`days-row-${hour}-column-${dayIndex}`"
            class="lsess-table-col d-flex align-center"
          >
            <table-entry v-if="getWeeklySchedule[dayIndex][hour - 1]" :entry="getWeeklySchedule[dayIndex][hour - 1]" />
          </v-col>
        </v-row>
      </div>
    </perfect-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { PerfectScrollbar } from 'vue2-perfect-scrollbar'

export default {
  name: 'SessionsTable',

  components: {
    PerfectScrollbar
  },

  data: () => {
    return {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      activeDay: new Date().getDay() - 1
    }
  },

  computed: {
    ...mapGetters('live-sessions', ['getWeeklySchedule'])
  }
}
</script>

<style lang="scss">
.lsess {
  &-table {
    position: relative;
    height: 100%;
    max-height: 100%;
    &-offset {
      width: 64px;
      font-size: 1.1rem;
      line-height: 1.5;
    }
    &-col {
      width: 20%;
      &-header {
        font-size: 1.1rem;
        line-height: 1.5;
        text-align: center;
        &-active {
          width: 75%;
          height: 3px;
          margin: 0 auto;
          margin-top: 8px;
          background-color: #8ab591;
          border-radius: 3px;
        }
      }
    }
    &-hour-row {
      width: calc(100% - 32px);
      height: 160px;
      border-bottom: solid 2px #f2f2f2;
      display: flex;
      flex-direction: row;
    }
  }
}
</style>

<style src="vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css"></style>

<style lang="scss" scoped>
::v-deep {
  .ps {
    position: relative;
    width: 100%;
    max-height: calc(100% - 51px);
    overflow: hidden !important;
    overflow-anchor: none;
    -ms-overflow-style: none;
    touch-action: auto;
    -ms-touch-action: auto;
  }

  .ps__rail-y {
    display: block;
    opacity: 1;
    background-color: #f2f2f2;
    transition: none;
    width: 16px;
    border-radius: 16px;
    margin: 32px 0px;
    /* there must be 'right' or 'left' for ps__rail-y */
    right: 0;
    /* please don't change 'position' */
    position: absolute;
  }

  .ps:hover > .ps__rail-x,
  .ps:hover > .ps__rail-y,
  .ps--focus > .ps__rail-x,
  .ps--focus > .ps__rail-y,
  .ps--scrolling-x > .ps__rail-x,
  .ps--scrolling-y > .ps__rail-y {
    opacity: 1;
  }

  .ps .ps__rail-x:hover,
  .ps .ps__rail-y:hover,
  .ps .ps__rail-x:focus,
  .ps .ps__rail-y:focus,
  .ps .ps__rail-x.ps--clicking,
  .ps .ps__rail-y.ps--clicking {
    opacity: 1;
  }

  .ps__thumb-y {
    background-color: #dce7b5;
    border-radius: 14px;
    transition: none;
    width: 14px;
    /* there must be 'right' for ps__thumb-y */
    right: 1px;
    /* please don't change 'position' */
    position: absolute;
  }

  .ps__rail-y:hover > .ps__thumb-y,
  .ps__rail-y:focus > .ps__thumb-y,
  .ps__rail-y.ps--clicking .ps__thumb-y {
    background-color: #dce7b5;
    width: 14px;
  }
}
</style>
