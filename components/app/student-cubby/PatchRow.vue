<template>
  <div class="mt-2">
    <v-row align="end" class="mb-2">
      <img :src="activityType.icon" height="32" class="mr-2">

      <div class="mx-3">
        <span
          class="font-weight-black text-outline subtitle-text carousel-text text-uppercase pg-letter-spacing"
          :style="{ '--bgColor': activityType.color }"
        >
          {{ activityType.name }}
        </span>
      </div>
    </v-row>

    <v-row no-gutters justify="space-between">
      <template v-if="$vuetify.breakpoint.smAndUp">
        <patch
          v-for="patch in activityType.patches"
          :key="`activityType-${activityType.id}-patch-${patch.id}`"
          :patch="patch"
          :to-unlock="activityType.toUnlock"
          :should-show-progress="isNextPatchToUnlock(patch.id)"
          class="mb-6"
        />
      </template>

      <perfect-scrollbar v-else>
        <v-row class="flex-nowrap mobile-patch-container">
          <patch
            v-for="patch in activityType.patches"
            :key="`activityType-${activityType.id}-patch-${patch.id}`"
            :patch="patch"
            :to-unlock="activityType.toUnlock"
            :should-show-progress="isNextPatchToUnlock(patch.id)"
            class="mb-6"
          />
        </v-row>
      </perfect-scrollbar>
    </v-row>
  </div>
</template>

<script>
import { PerfectScrollbar } from 'vue2-perfect-scrollbar'
import Patch from './Patch.vue'

export default {
  name: 'PatchRow',

  components: {
    Patch,
    PerfectScrollbar
  },

  props: {
    activityType: {
      type: Object,
      required: true
    }
  },

  computed: {
    nextPatchToUnlock () {
      return this.activityType.patches.find(patch => patch.unblocked === false) || {}
    }
  },

  methods: {
    isNextPatchToUnlock (id) {
      return id === this.nextPatchToUnlock.id
    }
  }
}
</script>

<style lang="scss" scoped>
.mobile-patch-container {
  overflow-x: visible;
}
</style>
