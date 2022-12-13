<template>
  <div
    class="holiday pa-5"
    :style="{ backgroundColor: hexToRgbA, width: holidayType === 'week' ? `calc(100% * ${holiday.cols})` : '100%', height, top: topPosition }"
  >
    <img class="holiday-icon mb-4" :src="holiday.iconUrl" alt="holiday icon" />
    <h1 class="holiday-title mb-4">
      {{ holiday.name }}
    </h1>
    <p class="holiday-description">
      {{ holiday.description }}
    </p>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'HolidayCard',
  props: {
    holiday: {
      type: Object,
      default: () => {},
      required: true
    },
    height: {
      type: String,
      required: true
    },
    topPosition: {
      type: String,
      required: true
    },
    holidayType: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const hexToRgbA = computed(() => {
      let c = props.holiday.color.substring(1).split('')
      c = '0x' + c.join('')
      return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + '0.9)'
    })

    return { hexToRgbA }
  }
})

</script>

<style lang="scss" scoped>
.holiday {
  position: absolute;
  left: 0;
  min-width: 100%;
  border-radius: 8px;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  &-icon {
    width: 100px;
  }

  &-title {
    font-family: 'Quicksand';
    font-weight: 700;
    font-size: 24px;
    line-height: 27px;
    text-align: center;
    color: #FFF7EE;
  }

  &-description {
    font-family: 'Quicksand';
    font-weight: 600;
    font-size: 16px;
    line-height: 20px;
    text-align: center;
    color: #FFFFFF;
  }
}
</style>
