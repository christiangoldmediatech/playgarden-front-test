<template>
  <v-hover v-if="$vuetify.breakpoint.smAndUp || displayMode" v-slot="{ hover }">
    <v-col
      :class="[
        'text-center patch-item mr-2',
        {
          clickable: patch.unblocked && !displayMode,
          scaled: hover && patch.unblocked && !displayMode,
        },
      ]"
      :cols="displayMode ? 12 : 2"
      :sm="displayMode ? 6 : 2"
      :md="displayMode ? 4 : 2"
      :xl="displayMode ? 3 : 2"
    >
      <v-row justify="center" align="center">
        <div v-if="displayMode" class="w-100">
          <template v-if="!$vuetify.breakpoint.mobile">
            <v-img
              :src="require('@/assets/svg/close-icon.svg')"
              class="clickable close-btn-playgarden"
              width="18px"
              @click.stop="close"
            />
          </template>

          <badge
            :patch="patch"
            :max-width="!displayMode ? 200 : undefined"
            :to-unlock="toUnlock"
            :should-show-progress="shouldShowProgress"
          />
        </div>

        <badge
          v-else
          :patch="patch"
          :max-width="!displayMode ? 200 : undefined"
          :to-unlock="toUnlock"
          :should-show-progress="shouldShowProgress"
        />
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

  <v-col v-else cols="5" class="px-6">
    <v-row justify="center" align="center">
      <badge
        :patch="patch"
        :to-unlock="toUnlock"
        :should-show-progress="shouldShowProgress"
      />
    </v-row>

    <span class="d-block text-center font-weight-bold">
      {{ patch.name }}
    </span>

    <span class="d-block text-center" :class="{ 'white--text': displayMode }">
      {{ patch.description }}
    </span>
  </v-col>
</template>

<script>
import Badge from '@/components/app/student-cubby/Badge'

export default {
  name: 'Patch',

  components: {
    Badge
  },

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
    toUnlock: {
      type: Number,
      default: 0
    },
    shouldShowProgress: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    close () {
      this.$nuxt.$emit('close-patch-overlay')
    },

    displayBadge () {
      if (this.patch.unblocked) {
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

.close-btn-playgarden {
  position: absolute !important;
  right: 30% !important;
}
</style>
