<template>
  <div class="mt-6">
    <!-- Circle and title -->
    <v-row class="flex-nowrap" align="center" justify="start">
      <v-col class="flex-shrink-1 flex-grow-0 py-0">
        <div :class="['number-circle', { 'number-circle-active': enabled }]">
          <span class="white--text">
            {{ number }}
          </span>
        </div>
      </v-col>
      <v-col class="content-header pl-0 py-0 text-uppercase d-flex justify-start align-center">
        {{ title }}
        <slot name="title-append" />
      </v-col>
    </v-row>
    <v-row>
      <v-col class="flex-shrink-1 flex-grow-0 py-1">
        <div class="progress-container justify-end">
          <div class="progress-track my-1">
            <div v-if="enabled" class="progress-next-thumb" :style="{ '--progressNextThumbHeight': `${progressNext}%` }" />
            <div class="progress-thumb" :style="{ '--progressThumbHeight': `${progress}%` }" />
          </div>
        </div>
      </v-col>
      <v-col class="content-section-slot pl-0 py-1">
        <slot />
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'ContentSection',

  props: {
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
    background-color: var(--v-primary-base);
  }
}

.content-header {
  font-size: 24px;
  font-weight: bold;
  color: #606060;
  line-height: 24px;
  letter-spacing: 0.15em;
}

.progress {
  &-container {
    width: 30px;
    height: 100%;
    display: flex;
    // justify-items: end;
  }

  &-track {
    position: relative;
    width: 11px;
    max-width: 11px;
    background-color: rgba(242, 237, 237, 0.85);
    height: calc(100% - 8px);
    border-radius: 5.5px;
  }

  &-thumb {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 11px;
    max-width: 11px;
    background-color: var(--v-primary-base);
    height: var(--progressThumbHeight);
    border-radius: 5.5px;
  }

  &-next-thumb {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 11px;
    max-width: 11px;
    background-color: rgba(194, 218, 165, 0.33);
    height: var(--progressNextThumbHeight);
    border-radius: 5.5px;
  }
}

.content-section-slot {
  overflow-x: hidden;
}
</style>
