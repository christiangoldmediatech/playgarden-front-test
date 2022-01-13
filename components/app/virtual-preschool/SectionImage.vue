<template>
  <div :style="`height: ${height}`">
    <v-img
      :src="section.imageUrl"
      gradient="rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15)"
      cover
      tile
      height="100%"
      position="top center"
      @click="$emit('click', section)"
    >
      <div class="section-content">
        <!-- Start Playing Button -->
        <img
          :data-test-id="`vp-section-${section.title}`"
          :style="`top: ${startPlayingTop}`"
          class="section-start-playing"
          src="@/assets/png/virtual-preschool/Start Playing.png"
        >

        <!-- Lady -->
        <img class="section-lady" :src="section.teacherUrl">

        <!-- Bubble -->
        <div class="section-bubble" />

        <!-- Bubble Text -->
        <div class="section-bubble-text">
          {{ section.message }}
          <v-btn icon class="my-n4 mx-n2">
            <v-icon class="white--text" size="22" @click.stop="$emit('click:play', section)">
              mdi-volume-high
            </v-icon>
          </v-btn>
        </div>
      </div>

      <!-- Section Button -->
      <div class="section-btn">
        <div>{{ section.title }}</div>
      </div>
    </v-img>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api'

interface Section {
  imageUrl: string
  teacherUrl: string
  title: string
  message: string
  audio: string
}

export default defineComponent({
  name: 'SectionImage',

  props: {
    section: {
      type: Object as PropType<Section>,
      default: () => ({})
    },

    height: {
      type: String,
      default: '50%'
    },

    startPlayingTop: {
      type: String,
      default: '50%'
    }
  },

  setup () {
    return {}
  }
})
</script>

<style lang="scss" scoped>
.section {
  padding: 0px;

  &-content {
    transition: 0.2s;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;

    &:hover {
      opacity: 1;
    }
  }

  &-bubble-text {
    color: white;
    font-weight: bold;
    font-size: 1rem;
    text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    background-color: rgba(255, 172, 52, 0.25);
    border: 4px solid rgba(255, 172, 52, 1);

    padding: 12px;
    border-top-left-radius: 30px;
    border-top-right-radius: 30px;
    border-bottom-left-radius: 30px;
    border-bottom-right-radius: 0px;
    width: 75%;
    position: absolute;
    top: 10%;
    left: 10%;
  }

  &-bubble {
    width: 75%;
    background: red;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 15px;
    left: 30px;
    opacity: 0;
  }

  &-lady {
    height: 60%;
    position: absolute;
    right: 0;
    bottom: 0;
    z-index: 1;
  }

  &-start-playing {
    cursor: pointer;
    height: 35%;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  &-btn {
    position: absolute;
    bottom: 10px;
    left: 10px;

    background: rgba(178, 230, 141, 0.2);
    border: 4px solid #B2E68D;
    box-sizing: border-box;
    border-radius: 8px;
    cursor: pointer;

    & div {
      color: white;
      font-size: 18px;
      font-weight: bold;
      text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

      padding-top: 4px;
      padding-bottom: 4px;
      padding-left: 12px;
      padding-right: 12px;
    }
  }
}

@media (min-width: $breakpoint-md) {
  .section {
    &-bubble-text {
      font-size: 1.3rem;
    }
  }
}

@media (max-width: $breakpoint-sm) {
  .section {
    padding: 12px;

    &-content {
      opacity: 1;
    }

    &-start-playing {
      visibility: hidden;
    }
  }
}
</style>
