<template>
  <div
    class="activity-type-header"
    :style="{ '--header-bkg': bkgColor }"
  >
    <div
      class="activity-type-header-icon"
      :style="{ '--circle-color': color }"
    >
      <img :src="icon">
    </div>

    <div class="activity-type-header-title">
      ALL {{ name.toUpperCase() }}
    </div>

    <v-btn
      class="activity-type-header-button"
      data-test-id="activity-type-header-button"
      color="primary"
      large
      @click="$emit('play-all')"
    >
      <v-icon left>
        mdi-play
      </v-icon>
      PLAY ALL
    </v-btn>
  </div>
</template>

<script>
import { hexToRgb } from '@/utils/colorTools'

export default {
  name: 'ActivityTypeHeader',

  props: {
    icon: {
      type: String,
      required: true
    },

    color: {
      type: String,
      required: true
    },

    name: {
      type: String,
      required: true
    }
  },

  computed: {
    bkgColor () {
      return hexToRgb(this.color.substring(1))
    }
  }
}
</script>

<style lang="scss">
.activity-type-header {
  width: 100%;
  margin-top: -36px;
  margin-bottom: 30px;
  padding-top: 44px;
  padding-bottom: 22px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgba(var(--header-bkg), 0.3);
  position: relative;

  &-icon {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #FFFFFF;
    border: 6px solid var(--circle-color);

    & img {
      width: 70%;
      height: 70%;
      object-fit: contain;
      object-position: center;
    }
  }

  &-title {
    font-size: 30px;
    font-weight: 700;
    line-height: 1.5;
    letter-spacing: 6px;
    color: #606060;
    text-align: center;
    @media screen and (min-width: 960px) {
      font-size: 44px;
    }
  }

  &-button {
    position: absolute;
    bottom: -22px;
  }
}
</style>
