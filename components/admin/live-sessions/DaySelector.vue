<template>
  <div class="day-selector">
    <v-icon
      color="accent"
      :disabled="loading"
      @click="$emit('prev-day')"
    >
      mdi-less-than
    </v-icon>

    {{ currentDay }}

    <v-icon
      color="accent"
      :disabled="loading"
      @click="$emit('next-day')"
    >
      mdi-greater-than
    </v-icon>
  </div>
</template>

<script>
export default {
  name: 'DaySelector',

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
    currentDay () {
      const dayName = this.day.toLocaleString('default', { weekday: 'long' })
      const day = this.day.getDate().toString().padStart(2, '0')
      const monthName = this.day.toLocaleString('default', { month: 'long' })

      return `${dayName}, ${monthName} ${day}, ${this.day.getFullYear()}`
    }
  }
}
</script>

<style lang="scss">
.day-selector {
  font-size: 18px;
  font-weight: 400;
  line-height: 1.5;
  text-align: center;
}
</style>
