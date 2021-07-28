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

<script lang="ts">
import { defineComponent, computed, toRefs } from '@nuxtjs/composition-api'

export default defineComponent({
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

  setup (props) {
    const { day } = toRefs(props)

    const currentDay = computed(() => {
      const dayName = day.value.toLocaleString('default', { weekday: 'long' })
      const dayNum = day.value.getDate().toString().padStart(2, '0')
      const monthName = day.value.toLocaleString('default', { month: 'long' })
      return `${dayName}, ${monthName} ${dayNum}, ${day.value.getFullYear()}`
    })

    return {
      currentDay
    }
  }
})
</script>

<style lang="scss">
.day-selector {
  font-size: 18px;
  font-weight: 400;
  line-height: 1.5;
  text-align: center;
}
</style>
