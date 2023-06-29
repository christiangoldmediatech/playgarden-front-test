<template>
  <div>
    <div class="ow-title">
      <span class="hidden-md-and-up">
        {{ $t('dailyLessons.onlineWorksheet.titleUppercase') }}
      </span>
      <span class="hidden-sm-and-down">
        {{ question.name }}
      </span>
      <br class="hidden-sm-and-down">
      <span class="hidden-sm-and-down">
        {{ $t('commonWords.day') + ' ' + day }}
      </span>
    </div>

    <div class="ow-progress">
      <div class="ow-progress-container">
        <div class="ow-progress-bar" :style="{ '--progress': progress }" />
      </div>
      <div class="ow-progress-steps">
        <div
          v-for="sheetIndex in (worksheets.length)"
          :key="`question-${worksheets[sheetIndex - 1].id}`"
          class="ow-progress-number"
          :class="{ 'ow-progress-number-active': (sheetIndex - 1) <= index }"
        >
          {{ sheetIndex }}
        </div>

        <v-tooltip
          v-if="puzzlePiece"
          content-class="ow-tooltip"
          top
          :close-delay="$vuetify.breakpoint.smAndDown ? 5000 : 0"
          open-on-click
          open-on-hover
          dark
          internal-activator
        >
          <template v-slot:activator="{ on, attrs }">
            <img
              :src="puzzlePiece.puzzle.image"
              class="ow-progress-img"
              v-bind="attrs"
              v-on="on"
            >
          </template>
          <span>
            {{ $t('dailyLessons.onlineWorksheet.complete') }}
          </span>
        </v-tooltip>
      </div>
      <puzzle-clip-path />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import PuzzleClipPath from '@/components/PuzzleClipPath.vue'

export default {
  name: 'OwHeader',

  components: {
    PuzzleClipPath
  },

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
    ...mapState('children/lesson', ['puzzlePiece']),

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
      align-items: center;
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
    &-img {
      width: 20px;
      height: 20px;
      object-fit: none;
      object-position: center;
      vertical-align: middle;
      clip-path: url(#myClip);
    }
  }
}
</style>

<style lang="scss" scoped>
.ow-tooltip.v-tooltip__content::after {
  content: none !important;
}
</style>
