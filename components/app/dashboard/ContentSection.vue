<template>
  <div>
    <v-row class="flex-nowrap" align="center" justify="start">
      <!-- CIRCLE WITH NUMBER -->
      <v-col cols="auto" class="z-index-1" data-test-id="lesson-letter-day-circle">
        <div :class="['number-circle', { 'number-circle-active': enabled }]">
          <span class="white--text">
            {{ number }}
          </span>
        </div>
      </v-col>

      <!-- SECTION TITLE -->
      <v-col :id="titleId" class="content-header pl-0 py-0 text-uppercase d-flex justify-start align-center">
        {{ title }}
        <slot name="title-append" />
      </v-col>
    </v-row>

    <v-row no-gutters class="mr-n4">
      <!-- TIMELINE -->
      <v-col class="flex-shrink-1 flex-grow-0">
        <div class="progress-container mt-n2">
          <div class="progress-track">
            <div v-if="enabled" class="progress-next-thumb" :style="{ '--progressNextThumbHeight': `${progressNext}%` }" />
            <div class="progress-thumb" :style="{ '--progressThumbHeight': `${progress}%` }" />
          </div>
        </div>
      </v-col>

      <!-- CONTENT -->
      <v-col class="content-section-slot ml-n5">
        <slot />
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'ContentSection',

  props: {
    titleId: {
      type: String,
      default: undefined
    },

    number: {
      type: [String, Number],
      required: true
    },

    title: {
      type: String,
      required: true
    },

    enabled: {
      type: Boolean,
      required: false,
      default: false
    },

    progress: {
      type: Number,
      required: false,
      default: 0
    },

    progressNext: {
      type: Number,
      required: false,
      default: 0
    }
  }
}
</script>

<style lang="scss">
.z-index-1 {
  z-index: 1;
}
.number-circle {
  width: 48px;
  height: 48px;
  background-color: #D2D2D2;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  line-height: 24px;
  border-radius: 50%;
  &-active {
    background-color: #68C453;
  }
}
.content-header {
  font-size: 24px;
  font-weight: bold;
  color: #707070;
  line-height: 24px;
  letter-spacing: 3.6px;
}
.progress {
  &-container {
    position: relative;
    left: 18px;
    width: 12px;
    height: 100%;
  }
  &-track {
    position: relative;
    width: 12px;
    max-width: 12px;
    background-color: rgba(242, 237, 237, 0.85);
    height: calc(100% + 12px);
    border-radius: 5.5px;
  }
  &-next-thumb {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 12px;
    max-width: 12px;
    background-color: #B2E68D;
    height: var(--progressNextThumbHeight);
    border-radius: 5.5px;
  }
  &-thumb {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 12px;
    max-width: 12px;
    background-color: var(--v-primary-base);
    height: var(--progressThumbHeight);
    border-radius: 5.5px;
  }
}
.content-section-slot {
  overflow-x: hidden;
  margin-top: 12px;
  margin-bottom: 12px;
}
</style>
