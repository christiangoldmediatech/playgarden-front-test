<template>
  <v-hover v-slot="{ hover }">
    <v-card
      :class="['portfolio-card', { 'clickable': !displayMode, 'scaled': hover && !displayMode }]"
      light
      :elevation="(hover && !displayMode) ? 9 : 0"
      @click.stop="$nuxt.$emit('open-portfolio-overlay', image)"
    >
      <v-img
        :src="image"
        :aspect-ratio="1"
      />
      <span
        class="d-block text-center font-weight-bold"
        :class="{ 'white--text': displayMode }"
      >
        name
      </span>

      <span class="d-block text-center" :class="{ 'white--text': displayMode }">
        descripcion
      </span>
    </v-card>
  </v-hover>
</template>

<script>
export default {
  name: 'PortfolioCard',

  props: {
    image: {
      type: [Object, Function, String],
      required: true
    },

    displayMode: {
      type: Boolean,
      required: false,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.portfolio-card {
  transition: transform 250ms;
}

.scaled {
  transform: scale(1.1);
  z-index: 1;
}
</style>
