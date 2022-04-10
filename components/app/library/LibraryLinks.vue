<template>
  <v-col
    class="header-links"
    v-bind="$attrs"
  >
    <nuxt-link
      class="patches-earned-link"
      :class="{ 'patches-solo': !showFavorites }"
      :to="{ name: 'app-student-cubby-patches' }"
    >
      <img
        src="@/assets/svg/library/patches-earned-button.svg"
        width="100%"
      >
    </nuxt-link>

    <nuxt-link
      v-if="showFavorites"
      class="favorites-link"
      :to="{ name: 'app-library-favorites' }"
    >
      <img
        src="@/assets/svg/library/favorites-button.svg"
        width="100%"
      >
    </nuxt-link>
  </v-col>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'LibraryLinks',

  props: {
    showFavorites: {
      type: Boolean,
      required: false,
      default: true
    }
  }
})
</script>

<style lang="scss" scoped>
.header-links {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  flex-grow: 0;
  flex-shrink: 1;
  justify-content: center;

  .patches-earned-link {
    max-width: 70%;
    &.patches-solo {
      max-width: 100%;
    }
  }

  .favorites-link {
    max-width: 30%;
  }
}
</style>
