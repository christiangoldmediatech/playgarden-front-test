<template>
  <div
    class="library-category-icon"
    :style="{
      '--border-color': borderColor
    }"
  >
    <img :src="icon">
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'LibraryCategoryIcon',

  props: {
    borderColor: {
      type: String,
      required: true
    },

    icon: {
      type: String,
      required: true
    }
  }
})
</script>

<style lang="scss" scoped>
.library-category-icon {
  position: absolute;
  margin-left: 20%;
  margin-top: - 2%;
  width: 57px;
  max-width: 57px;
  aspect-ratio: 1;
  border-radius: 50%;
  background-color: #FFFFFF;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 5px solid var(--border-color);

  @media screen and (min-width: 1264px) {
    position: relative;
    margin: 0;
    width: 97px;
    max-width: 97px;
    margin-right: 34px;
    border: 9px solid var(--border-color);
  }

  img {
    width: 75%;
    aspect-ratio: 1;
    object-fit: contain;
    object-position: center center;
  }
}
</style>
