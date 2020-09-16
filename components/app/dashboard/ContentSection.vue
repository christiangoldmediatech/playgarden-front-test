<template>
  <div>
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
            <div class="progress-thumb" :style="{ '--progressThumbHeight': `${progress}%` }" />
          </div>
        </div>
      </v-col>
      <v-col class="content pl-0 py-1">
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
    }
  }
}
</script>

<style lang="scss">
.number-circle {
  width: 48px;
  height: 48px;
  background-color: #D2D2D2;
  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.18);
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
    width: 11px;
    max-width: 11px;
    background-color: rgba(242, 237, 237, 0.85);
    height: calc(100% - 8px);
    border-radius: 5.5px;
  }

  &-thumb {
    width: 11px;
    max-width: 11px;
    background-color: var(--v-primary-base);
    height: var(--progressThumbHeight);
    border-radius: 5.5px;
  }
}

.content {
  overflow-x: hidden;
}
</style>
