<template>
  <v-hover v-slot="{ hover }">
    <div class="pg-h-auto">
      <v-img
        :src="section.imageUrl"
        gradient="rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15)"
        class="pg-rounded-md"
        cover
        tile
        height="100%"
        position="top center"
        @click="$emit('click', section)"
      >
        <!-- Section Button -->
        <div
          :class="{
            'section-top': !$vuetify.breakpoint.smAndDown,
            'translucent': hover,
            'section-btn': $vuetify.breakpoint.smAndDown,
          }"
        >
          <div>{{ section.title }}</div>
        </div>

        <div class="section-content">
          <!-- Start Playing Button -->
          <img
            :data-test-id="`vp-section-${section.title}`"
            :style="small ? `top: 75%; height: 60%;` : `top: 50%; height: 35%;`"
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
      </v-img>
    </div>
  </v-hover>
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
    small: {
      type: Boolean,
      default: false
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
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  &-btn {
    position: absolute;
    bottom: 10px;
    left: 10px;

    background: rgb(104, 196, 83);
    box-sizing: border-box;
    border-radius: 8px;
    cursor: pointer;

    & div {
      color: white;
      font-size: 18px;
      font-weight: 500;
      text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
      padding: 8px 12px;
    }
  }

  &-top {
    position: absolute;
    top: 15px;
    left: 15px;

    background: rgb(104, 196, 83);
    box-sizing: border-box;
    border-radius: 8px;
    cursor: pointer;

    & div {
      color: white;
      font-size: 18px;
      font-weight: 500;
      text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
      padding: 8px 12px;
    }
  }

}

.translucent {
  opacity: 0.25;
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
