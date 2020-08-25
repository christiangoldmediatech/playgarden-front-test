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
  name: 'UnderlinedSubtitle',

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
  position: relative;
  z-index: 1;
  color: $pg-black;
  font-weight: 500;
  font-size: 18px;
  &::after {
    width: 105%;
    position: absolute;
    bottom: 3px;
    left: -3%;
    content: "";
    z-index: -1;
    border-bottom: 5px solid $pg-accent;
    border-radius: 0px;
  }
}
</style>
