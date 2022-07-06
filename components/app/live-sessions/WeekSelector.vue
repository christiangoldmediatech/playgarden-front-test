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
import { getMondayFriday } from '@/utils/dateTools'

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
      const days = getMondayFriday(this.day)

      const PART_A_MONTH = days.monday.toLocaleString('default', { month: 'long' })
      partA = `${PART_A_MONTH} ${days.monday.getDate().toString().padStart(2, '0')}`

      if (days.monday.getMonth() !== days.friday.getMonth()) {
        const PART_B_MONTH = days.friday.toLocaleString('default', { month: 'long' })
        partB = `${PART_B_MONTH} ${days.friday.getDate().toString().padStart(2, '0')}, ${days.friday.getFullYear()}`
        if (days.monday.getFullYear() !== days.friday.getFullYear()) {
          partA += `, ${days.monday.getFullYear()}`
        }
      } else {
        partB = `${days.friday.getDate().toString().padStart(2, '0')}, ${days.friday.getFullYear()}`
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
