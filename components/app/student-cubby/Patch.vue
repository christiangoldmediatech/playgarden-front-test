<template>
  <v-hover v-slot="{ hover }">
    <v-col
      :class="[
        'text-center patch-item',
        {
          clickable: _unblocked && !displayMode,
          scaled: hover && _unblocked && !displayMode
        }
      ]"
      cols="12"
      sm="6"
      :lg="displayMode ? 3 : 2"
      xl="2"
      @click.stop="displayBadge"
    >
      <v-row justify="center" align="center">
        <v-badge
          v-if="displayMode"
          class="w-100"
          avatar
          color="white"
          offset-x="15%"
          offset-y="15%"
          overlap
        >
          <template v-slot:badge>
            <v-avatar class="clickable" @click.stop="close">
              <v-icon color="#757575" size="20">
                mdi-close
              </v-icon>
            </v-avatar>
          </template>

          <v-responsive
            class="rounded-circle"
            aspect-ratio="1"
            :max-width="!displayMode ? 200 : undefined"
          >
            <v-img
              :class="{ grayscale: !_unblocked }"
              :src="patch.image"
              aspect-ratio="1"
            />
          </v-responsive>
        </v-badge>

        <v-responsive
          v-else
          class="rounded-circle"
          aspect-ratio="1"
          :max-width="!displayMode ? 200 : undefined"
        >
          <v-img
            :class="{ grayscale: !_unblocked }"
            :src="patch.image"
            aspect-ratio="1"
          />
        </v-responsive>
      </v-row>

      <span
        class="d-block text-center font-weight-bold"
        :class="{ 'white--text': displayMode }"
      >
        {{ patch.name }}
      </span>

      <span class="d-block text-center" :class="{ 'white--text': displayMode }">
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

  computed: {
    _unblocked () {
      return this.unblocked && this.unblocked[this.patch.id]
    }
  },

  methods: {
    close () {
      this.$nuxt.$emit('close-patch-overlay')
    },

    displayBadge () {
      if (this._unblocked) {
        this.$nuxt.$emit('open-patch-overlay', this.patch)
      }
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
