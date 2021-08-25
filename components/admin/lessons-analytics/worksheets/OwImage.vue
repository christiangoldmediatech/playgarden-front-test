<template>
  <v-card class="content-dashboard">
    <v-card-title>
      <div class="ow-image-answer-card">
        <img class="ow-image-answer-image" :src="image.image">
      </div>
    </v-card-title>
    <v-card-text class="mt-4">
      <div class="text-center">
        <img v-if="image.is_correct" height="30px;" src="@/assets/svg/ok.svg">
        <img v-else height="30px;" src="@/assets/svg/fail.svg">
        <br>
        <span class="font-weight-bold">User Answers</span><br>
        <label class="display-3 font-weight-bold total-users"> {{ clicks }}</label>
        <br>
        <span>Clicks</span>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'OwImage',

  props: {
    image: {
      type: Object,
      required: true
    },
    clicks: {
      type: Number,
      required: true
    }
  }
})
</script>

<style lang="scss" scoped>
.total-users {
  color: var(--v-accent-base) !important;
}
.card-image {
  position: absolute !important;
  width: 85% !important;
}
.ow {
  &-image-answer {
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
        border: solid #68C453 4px;
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
    &-image {
      width: 100%;
      height: 100%;
      object-fit: contain;
      object-position: center;
    }
  }
}
</style>
