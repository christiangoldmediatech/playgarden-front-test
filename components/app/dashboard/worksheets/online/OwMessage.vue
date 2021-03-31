<template>
  <pg-dialog
    v-model="dialog"
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
          @click.stop="onClose"
        >
          <v-icon>
            mdi-close
          </v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text v-if="selectedImage">
        <div class="ow-dialog-title">
          <span v-if="correct">
            GREAT JOB!
          </span>
          <span v-else>
            OOPS!
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

        <div class="ow-dialog-word">
          {{ selectedImage.word }}
        </div>

        <div class="ow-dialog-text">
          <slot>
            {{ selectedImage.errorMessage }}
          </slot>
        </div>

        <div class="ow-dialog-button">
          <v-btn
            color="primary"
            large
            block
            @click.stop="onClose"
          >
            <slot name="button">
              <v-icon left small>
                mdi-less-than
              </v-icon>
              Go Back
            </slot>
          </v-btn>
        </div>
      </v-card-text>
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
