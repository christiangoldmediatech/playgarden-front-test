<template>
  <v-hover v-slot="{ hover }">
    <v-col
      :class="[
        'text-center patch-item',
        { clickable: !displayMode, scaled: hover && !displayMode }
      ]"
      cols="12"
      sm="6"
      :lg="displayMode ? 3 : 2"
      xl="2"
      @click.stop="displayBadge"
    >
      <v-responsive
        class="rounded-circle"
        aspect-ratio="1"
        :max-width="!displayMode ? 200 : undefined"
      >
        <v-img
          :class="{ grayscale: unblocked && !unblocked[patch.id] }"
          :src="patch.image"
          aspect-ratio="1"
        />
      </v-responsive>

      <span class="d-block text-center font-weight-bold">
        {{ patch.name }}
      </span>

      <span class="d-block text-center">
        {{ patch.description }}
      </span>
    </v-col>
  </v-hover>
</template>

<script>
export default {
  name: 'Patch',

  props: {
    patch: {
      type: Object,
      required: true
    },

    displayMode: {
      type: Boolean,
      required: false,
      default: false
    },

    unblocked: {
      type: Object,
      required: true
    }
  },

  methods: {
    displayBadge () {
      this.$nuxt.$emit('open-patch-overlay', this.patch)
    }
  }
}
</script>

<style lang="scss" scoped>
.patch-item {
  transition: transform 250ms;
}

.scaled {
  transform: scale(1.1);
  z-index: 1;
}
</style>
