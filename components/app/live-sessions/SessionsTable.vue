<template>
  <div>
    <div class="pl-16">
      <v-row>
        <v-col v-for="(day, index) in days" :key="`days-row-column-${index}`" class="lsess-table-col lsess-table-col-header">
          {{ day }}

          <div v-if="index === activeDay" class="lsess-table-col-header-active" />
        </v-col>
      </v-row>
    </div>

    <div v-for="i in 16" :key="`hour-${i}`" class="lsess-table-hour-row">
      <div class="d-flex align-center justify-center lsess-table-offset">
        {{ 7 + i }}:00
      </div>
      <v-row>
        <v-col
          v-for="(day, index) in days"
          :key="`days-row-${i}-column-${index}`"
          class="lsess-table-col"
        >
          <table-entry v-if="index === 3 && i === 4" />
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SessionsTable',

  data: () => {
    return {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      activeDay: new Date().getDay() - 1
    }
  }
}
</script>

<style lang="scss">
.lsess {
  &-table {
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
      height: 160px;
      border-bottom: solid 2px #f2f2f2;
      display: flex;
      flex-direction: row;
    }
  }
}
</style>
