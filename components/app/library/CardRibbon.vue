<template>
  <div class="ribbon">
    <span>{{ text }}</span>
  </div>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'CardViewedRibbon',

  props: {
    text: {
      type: String,
      default: ''
    }
  }
})
</script>

<style lang="scss" scoped>
.ribbon {
  position: absolute;
  display: flex;
  justify-content: center;
  top: 0;
  right: 0;
  z-index: 1;
  left: calc(100% - 100px);
  width: 100px;
  height: 40px;
  border-radius: 4px 8px;
  background: rgba(0, 0, 0, 0.4);

  & span {
    align-self: center;
    font-size: 16px;
    font-weight: bold;
    color: white;
    text-transform: uppercase;
    letter-spacing: 1.7px;
  }
}
</style>
