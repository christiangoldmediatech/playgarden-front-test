<template>
  <v-card class="dashboard-content-card-2">
    <template v-if="worksheets.length">
      <div class="dashboard-content-card-2-line-1" />
      <div class="dashboard-content-card-2-line-2" />
      <div class="dashboard-content-card-2-content">
        <div class="online-worksheet-title">
          <span class="hidden-md-and-up">
            ONLINE WORKSHEET
          </span>
          <span class="hidden-sm-and-down">
            {{ question.name }}
          </span>
          <br class="hidden-sm-and-down">
          <span class="hidden-sm-and-down">
            DAY {{ lesson.day }}
          </span>
        </div>

        <div class="online-worksheet-progress">
          <div class="online-worksheet-progress-container">
            <div class="online-worksheet-progress-bar" :style="{ '--progress': progress }" />
          </div>
          <div class="online-worksheet-progress-steps">
            <div
              v-for="(sheet, sheetIndex) in worksheets"
              :key="`question-${sheet.worksheetId}`"
              class="online-worksheet-progress-number"
              :class="{ 'online-worksheet-progress-number-active': sheetIndex <= index }"
            >
              {{ sheetIndex + 1 }}
            </div>
          </div>
        </div>

        <div class="online-worksheet-question">
          {{ question.description }}
        </div>

        <div class="online-worksheet-answers">
          <div
            v-for="image in question.worksheetTable.images"
            :key="`image-${image.code}`"
            class="online-worksheet-answer"
          >
            <v-hover v-slot="{ hover }">
              <div
                class="clickable"
                @click="select(image.code)"
              >
                <div
                  class="online-worksheet-answer-card"
                  :class="{
                    'online-worksheet-answer-card-scaled': hover,
                    'online-worksheet-answer-card-active': image.code === selected
                  }"
                >
                  <img class="online-worksheet-image" :src="image.image">
                </div>
                <div class="online-worksheet-answer-text">
                  {{ image.word }}
                </div>
              </div>
            </v-hover>
          </div>
        </div>

        <div class="online-worksheet-button">
          <v-btn
            color="primary"
            block
            :large="$vuetify.breakpoint.smAndUp"
            :disabled="selected === null"
            @click.stop="answerDialog = true"
          >
            Continue
            <v-icon right small>
              mdi-greater-than
            </v-icon>
          </v-btn>
        </div>
      </div>
    </template>
    <v-dialog
      v-model="answerDialog"
      width="auto"
      max-width="784"
      max-height="652"
    >
      <v-card>
        <v-card-title class="hidden-md-and-up">
          <v-spacer />
          <v-btn
            text
            icon
            @click.stop="answerDialog = false"
          >
            <v-icon>
              mdi-close
            </v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text v-if="selectedImage">
          <div class="online-worksheet-dialog-title">
            <span v-if="correct">
              GREAT JOB!
            </span>
            <span v-else>
              OOPS!
            </span>
          </div>

          <div class="online-worksheet-dialog-selection">
            <div class="online-worksheet-dialog-selection-card">
              <img
                v-if="selectedImage"
                class="online-worksheet-image"
                :src="selectedImage.image"
              >
              <div class="online-worksheet-dialog-selection-indicator">
                <img v-if="correct" src="@/assets/svg/correct.svg">
                <img v-else src="@/assets/svg/incorrect.svg">
              </div>
            </div>
          </div>

          <div class="online-worksheet-dialog-word">
            {{ selectedImage.word }}
          </div>

          <div class="online-worksheet-dialog-text">
            Correct/Incorrect message will go here
          </div>

          <div class="online-worksheet-dialog-button">
            <v-btn
              color="primary"
              large
              block
              @click.stop="answerDialog = false"
            >
              <v-icon left small>
                mdi-less-than
              </v-icon>
              Go Back
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'OnlineWorksheetRedesign',

  data: () => {
    return {
      index: 0,
      answerDialog: false,
      correct: false,
      selected: null
    }
  },

  computed: {
    ...mapGetters('admin/curriculum', { lesson: 'getLesson' }),

    worksheets () {
      if (this.lesson) {
        return this.lesson.worksheets.filter(({ type }) => type === 'ONLINE')
      }
      return []
    },

    progress () {
      if (this.worksheets.length) {
        return `${((this.index + 1) / this.worksheets.length) * 100}%`
      }
      return '0%'
    },

    question () {
      if (this.worksheets.length) {
        return this.worksheets[this.index]
      }
      return null
    },

    selectedImage () {
      if (this.worksheets.length && this.selected) {
        return this.worksheets[this.index].worksheetTable.images.find(({ code }) => code === this.selected)
      }
      return null
    }
  },

  methods: {
    select (code) {
      if (this.selected === code) {
        this.selected = null
        return
      }
      this.selected = code
    }
  }
}
</script>

<style lang="scss">
.online-worksheet {
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
  &-question {
    margin-top: 16px;
    text-align: center;
    font-weight: bold;
    font-size: 14px;
    line-height: 2.57;
    padding: 0 8px;
    @media screen and (min-width: 600px) {
      font-size: 23px;
    }
    @media screen and (min-width: 1904px) {
      font-size: 32px;
    }
  }
  &-answers {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }
  &-answer {
    width: 100%;
    max-width: calc(50% - 24px);
    margin: 12px;
    text-align: center;
    @media screen and (min-width: 600px) {
      max-width: calc(25% - 24px);
    }
    &-card {
      width: 105px;
      height: 105px;
      max-width: 105px;
      max-height: 105px;
      margin: 0 auto;
      transition: transform 250ms ease-in-out;
      border: solid #D2D2D2 0px;
      background-color: #ffffff;
      padding: 8px;
      box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.15);
      border-radius: 8px;
      @media screen and (min-width: 1264px) {
        width: 160px;
        height: 160px;
        max-width: 160px;
        max-height: 160px;
      }
      @media screen and (min-width: 1904px) {
        width: 210px;
        height: 210px;
        max-width: 210px;
        max-height: 210px;
      }
      &-active {
        border: solid #C2DAA5 4px;
        box-shadow: 0px 8px 24px #B6C89F;
      }
      &-scaled {
        transform: scale(1.075);
        z-index: 1;
      }
    }
    &-text {
      margin-top: 12px;
      font-size: 13px;
      line-height: 1.46;
      @media screen and (min-width: 600px) {
        font-weight: 400;
        font-size: 16px;
      }
      @media screen and (min-width: 1264px) {
        margin-top: 20px;
        font-weight: 500;
        font-size: 19px;
      }
      @media screen and (min-width: 1904px) {
        margin-top: 32px;
        font-weight: 600;
        font-size: 22px;
      }
    }
  }
  &-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center;
  }
  &-button {
    width: 271px;
    margin: 32px auto;
  }
  &-dialog {
    &-title {
      font-size: 18px;
      line-height: 1.5;
      text-align: center;
      font-weight: bold;
      color: #606060;
      margin-bottom: 15px;
      @media screen and (min-width: 960px) {
        font-size: 32px;
        letter-spacing: 4.8px;
        padding-top: 32px;
        margin-bottom: 25px;
      }
    }
    &-selection {
      margin-bottom: 12px;
      @media screen and (min-width: 960px) {
        margin-bottom: 48px;
      }
      &-card {
        width: 160px;
        height: 160px;
        max-width: 160px;
        max-height: 160px;
        margin: 0 auto;
        background-color: #ffffff;
        padding: 8px;
        box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.15);
        border-radius: 8px;
        position: relative;
        @media screen and (min-width: 960px) {
          width: 210px;
          height: 210px;
          max-width: 210px;
          max-height: 210px;
        }
      }
      &-indicator {
        position: absolute;
        bottom: -10px;
        right: -10px;
        max-width: 40px;
        max-height: 40px;
        @media screen and (min-width: 960px) {
          bottom: -15px;
          right: -15px;
          max-width: 60px;
          max-height: 60px;
        }
        & img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: center;
        }
      }
    }
    &-word {
      text-align: center;
      font-weight: 700;
      font-size: 13px;
      line-height: 1.5;
      @media screen and (min-width: 960px) {
        display: none;
      }
    }
    &-text {
      text-align: center;
      margin-bottom: 28px;
      font-weight: 500;
      font-size: 13px;
      line-height: 1.5;
      @media screen and (min-width: 960px) {
        font-weight: 600;
        font-size: 22px;
        margin-bottom: 36px;
      }
    }
    &-button {
      padding: 0 5%;
      @media screen and (min-width: 600px) {
        padding: 0 11%;
      }
      @media screen and (min-width: 960px) {
        padding: 0 22%;
        margin-bottom: 28px;
      }
    }
  }
}
</style>
