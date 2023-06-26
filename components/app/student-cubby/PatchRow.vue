<template>
  <div class="mt-2">
    <v-row align="end" class="mb-4 mt-4">
      <img :src="activityType.icon" height="32" class="mr-2">

      <div class="mx-3">
        <span
          class="font-weight-black text-outline subtitle-text text--color-black-base carousel-text text-uppercase pg-letter-spacing"
          :style="{ '--bgColor': activityType.color }"
        >
          {{ translatedCategory }}
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
          :activity-type-name="activityType.name"
          :activity-type-id="activityType.id"
        />
      </template>

      <perfect-scrollbar v-else>
        <v-row class="flex-nowrap mobile-patch-container my-6">
          <patch
            v-for="patch in activityType.patches"
            :key="`activityType-${activityType.id}-patch-${patch.id}`"
            :patch="patch"
            :to-unlock="activityType.toUnlock"
            :should-show-progress="isNextPatchToUnlock(patch.id)"
            :activity-type-name="activityType.name"
            :activity-type-id="activityType.id"
            data-test-id="patch"
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
    },
    translatedCategory () {
      return this.$t(`commonWords.activitiesType.${this.activityType.name.toLowerCase()}`)
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
.text--color-black-base{
  color:var(--v-black-base);
}
</style>
