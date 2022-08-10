<template>
  <div class="week-selector">
    <v-icon
      color="accent"
      :disabled="loading"
      @click="$emit('prev-week')"
    >
      mdi-less-than
    </v-icon>

    {{ currentWeek }}

    <v-icon
      color="accent"
      :disabled="loading"
      @click="$emit('next-week')"
    >
      mdi-greater-than
    </v-icon>
  </div>
</template>

<script>
import { getWeekStartAndEnd } from '@/utils/dateTools'

export default {
  name: 'WeekSelector',

  props: {
    day: {
      type: Date,
      required: true
    },

    loading: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  computed: {
    currentWeek () {
      let partA = ''
      let partB = ''
      const days = getWeekStartAndEnd(this.day)

      const PART_A_MONTH = days.sunday.toLocaleString('default', { month: 'long' })
      partA = `${PART_A_MONTH} ${days.sunday.getDate().toString().padStart(2, '0')}`

      if (days.sunday.getMonth() !== days.saturday.getMonth()) {
        const PART_B_MONTH = days.saturday.toLocaleString('default', { month: 'long' })
        partB = `${PART_B_MONTH} ${days.saturday.getDate().toString().padStart(2, '0')}, ${days.saturday.getFullYear()}`
        if (days.sunday.getFullYear() !== days.saturday.getFullYear()) {
          partA += `, ${days.sunday.getFullYear()}`
        }
      } else {
        partB = `${days.saturday.getDate().toString().padStart(2, '0')}, ${days.saturday.getFullYear()}`
      }

      return `${partA} - ${partB}`
    }
  }
}
</script>

<style lang="scss">
.week-selector {
  font-size: 18px;
  font-weight: 400;
  line-height: 1.5;
  text-align: center;
}
</style>
