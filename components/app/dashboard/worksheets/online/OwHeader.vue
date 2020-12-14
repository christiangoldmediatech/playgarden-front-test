<template>
  <div>
    <div class="ow-title">
      <span class="hidden-md-and-up">
        ONLINE WORKSHEET
      </span>
      <span class="hidden-sm-and-down">
        {{ question.name }}
      </span>
      <br class="hidden-sm-and-down">
      <span class="hidden-sm-and-down">
        DAY {{ day }}
      </span>
    </div>

    <div class="ow-progress">
      <div class="ow-progress-container">
        <div class="ow-progress-bar" :style="{ '--progress': progress }" />
      </div>
      <div class="ow-progress-steps">
        <div
          v-for="(sheet, sheetIndex) in worksheets"
          :key="`question-${sheet.worksheetId}`"
          class="ow-progress-number"
          :class="{ 'ow-progress-number-active': sheetIndex <= index }"
        >
          {{ sheetIndex + 1 }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OwHeader',

  props: {
    day: {
      type: [Number, String],
      required: true
    },
    question: {
      type: Object,
      required: true
    },
    worksheets: {
      type: Array,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  },

  computed: {
    progress () {
      if (this.worksheets.length) {
        return `${((this.index + 1) / this.worksheets.length) * 100}%`
      }
      return '0%'
    }
  }
}
</script>

<style lang="scss">
.ow {
  &-title {
    font-weight: bold;
    font-size: 13px;
    line-height: 1.5;
    letter-spacing: 4.8px;
    text-transform: uppercase;
    text-align: center;
    margin-top: 19px;
    color: rgba(96, 96, 96, 1);
    @media screen and (min-width: 600px) {
      font-size: 23px;
    }
    @media screen and (min-width: 1904px) {
      font-size: 32px;
    }
  }
  &-progress {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 375px;
    margin: 19px auto;
    &-container {
      width: 47%;
      max-width: 250px;
      height: 13px;
      border-radius: 20px;
      overflow: hidden;
      background-color: rgba(244, 239, 239, 1);
    }
    &-bar {
      transition: width 250ms;
      width: var(--progress);
      height: 100%;
      border-radius: 20px;
      background-color: rgba(194, 218, 165, 1);
    }
    &-steps {
      display: flex;
      justify-content: space-between;
      width: 47%;
      padding: 0 2%;
      margin-top: 10px;
    }
    &-number {
      font-weight: 700;
      font-size: 17px;
      line-height: 1.5;
      color: #D2D2D2;
      transition: color 250ms;
      &-active {
        color: rgba(194, 218, 165, 1);
      }
    }
  }
}
</style>
