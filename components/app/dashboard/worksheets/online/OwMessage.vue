<template>
  <pg-dialog
    v-model="dialog"
    width="auto"
    max-width="600"
    max-height="652"
  >
    <v-card class="rounded-xl">
      <div class="ow-close-btn">
        <v-btn
          icon
          color="white"
          class="pg-bg-[#F6B7D2]"
          @click="onClose"
        >
          <v-icon>
            mdi-close
          </v-icon>
        </v-btn>
      </div>

      <v-card-text v-if="selectedImage">
        <div class="ow-dialog-title">
          <span v-if="correct">
            {{ $t('dailyLessons.onlineWorksheet.messageDialog1') }}
          </span>
          <span v-else>
            {{ $t('dailyLessons.onlineWorksheet.messageDialog2') }}
          </span>
        </div>

        <div class="ow-dialog-selection">
          <div class="ow-dialog-selection-card">
            <img
              v-if="selectedImage"
              class="ow-dialog-image"
              :src="selectedImage.image"
            >
            <div class="ow-dialog-selection-indicator">
              <img v-if="correct" src="@/assets/svg/correct.svg">
              <img v-else src="@/assets/svg/incorrect.svg">
            </div>
          </div>
        </div>

        <div v-if="!correct" class="ow-dialog-word">
          {{ selectedImage.word }}
        </div>

        <div class="ow-dialog-text">
          <slot>
            {{ selectedImage.errorMessage }}
          </slot>
        </div>

        <div class="ow-dialog-button">
          <v-btn
            :color="correct ? 'primary' : '#F15959'"
            large
            block
            class="white--text"
            @click.stop="onClose"
          >
            <slot name="button">
              <v-icon left small>
                mdi-less-than
              </v-icon>
              {{ $t('commonWords.return2') }}
            </slot>
          </v-btn>
        </div>
      </v-card-text>

      <div class="d-flex justify-center w-100 ow-content-bars">
        <img src="@/assets/svg/color-bars.svg" width="80%" />
      </div>
    </v-card>
  </pg-dialog>
</template>

<script>
export default {
  name: 'OwMessage',

  props: {
    correct: {
      type: Boolean,
      required: true
    },

    selectedImage: {
      validator: (val) => {
        return typeof val === 'object' || val === null
      },
      required: false,
      default: null
    }
  },

  data: () => {
    return {
      dialog: false
    }
  },

  created () {
    this.$nuxt.$on('show-ow-message', () => {
      this.dialog = true
    })
  },

  methods: {
    onClose () {
      if (this.correct) {
        this.$emit('next')
      }
      this.dialog = false
    }
  }
}
</script>

<style lang="scss">
.ow {
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
    &-image {
      width: 100%;
      height: 100%;
      object-fit: contain;
      object-position: center;
    }
    &-word {
      text-align: center;
      font-weight: 500;
      font-size: 25px;
      line-height: 42px;
      color: #606060;
    }
    &-text {
      text-align: center;

      color: #606060;
      @media screen and (min-width: 960px) {
        font-weight: 400;
        font-size: 25px;
        line-height: 42px;
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
  &-content-bars {
    position: absolute;
    bottom: 0;
  }
  &-close-btn {
    position: absolute;
    top: 20px;
    right: 20px;
  }
}
</style>
