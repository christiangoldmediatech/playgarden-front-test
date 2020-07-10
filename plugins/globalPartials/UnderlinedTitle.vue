<template>
  <span
    v-bind="$attrs"
    class="underlined-title"
    v-on="$listeners"
  >
    {{ text }}
  </span>
</template>

<script>
export default {
  name: 'UnderlinedTitle',

  props: {
    text: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.underlined-title {
  font-size: 50px;
  font-weight: bold;
  position: relative;
  z-index: 1;
  &::after {
    width: 100%;
    position: absolute;
    bottom: 5px;
    left: 0;
    content: "";
    z-index: -1;
    border-bottom: 20px solid $pg-main;
    border-radius: 5px;
  }
}
</style>
