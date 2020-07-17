<template>
  <span
    v-bind="$attrs"
    :class="{
      'text-h5 font-weight-bold text-uppercase': $vuetify.breakpoint.smAndDown,
      'text-none': $vuetify.breakpoint.mdAndUp,
      'underlined-title': $vuetify.breakpoint.mdAndUp
    }"
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
    width: 102%;
    position: absolute;
    bottom: 15%;
    left: -1%;
    content: "";
    z-index: -1;
    border-bottom: 20px solid $pg-main;
    border-radius: 7px;
  }
}
</style>
