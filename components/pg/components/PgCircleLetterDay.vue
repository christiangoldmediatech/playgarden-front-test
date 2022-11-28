<template>
  <div
    :class="{
      'pg-letter-day-size': noAutoPosition,
      'pg-letter-day-row': !noAutoPosition
    }"
    :style="{
      '--pg-letter-day-size': `${size}px`
    }"
  >
    <!--      position: noAutoPosition ? 'relative' : null,-->
    <!--      top: noAutoPosition ? 0 : null,-->
    <!--      width: noAutoPosition ? '100px' : null,-->
    <div
      class="pg-letter-day-outer"
      :class="{ 'pg-letter-day-size': !noAutoPosition, 'pg-letter-day-outer-light': lightTheme }"
    >
      <div class="pg-letter-day-inner" :class="{ 'pg-letter-day-inner-background': lightTheme }">
        <div class="pg-letter-day-circle">
          <span
            class="pg-letter-day-letter"
            :style="{ fontSize: `${size * (day ? 0.31 : 0.44)}px` }"
          >
            {{ letter }}
          </span>

          <span
            v-if="day"
            class="pg-letter-day-number"
            :class="{ 'pg-letter-day-number-light': lightTheme }"
            :style="{ fontSize: `${size * 0.15}px`, marginBottom: `${size * 0.07}px`, letterSpacing }"
          >
            DAY {{ day }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PgCircleLetterDay',

  props: {
    day: {
      type: [Number, String],
      default: undefined
    },

    letter: {
      type: String,
      default: ''
    },

    noAutoPosition: Boolean,

    size: {
      type: [Number, String],
      default: 158
    },

    letterSpacing: {
      type: [Number, String],
      default: '1.2px'
    },

    lightTheme: {
      type: Boolean,
      default: false
    }
  }
}
</script>
