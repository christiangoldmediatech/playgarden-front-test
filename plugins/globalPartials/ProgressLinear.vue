<template>
  <v-progress-linear v-if="horizontal" v-bind="$attrs" :height="width" />

  <div
    v-else
    class="wrapper"
    :style="{
      width,
      height
    }"
  >
    <v-progress-linear
      v-bind="$attrs"
      class="progress-linear"
      :height="width"
      :style="{
        margin: `0 ${width}`,
        width: height
      }"
    />
  </div>
</template>

<script>
export default {
  name: 'ProgressLinear',

  props: {
    height: {
      type: String,
      default: '200px'
    },

    horizontal: Boolean,

    width: {
      type: String,
      default: '4px'
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  overflow: hidden;

  .progress-linear {
    transform: rotate(90deg);
    transform-origin: 0 0;
  }
}
</style>
