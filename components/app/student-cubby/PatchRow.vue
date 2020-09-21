<template>
  <div class="mt-2">
    <v-row align="end" class="mb-2">
      <img
        :src="activityType.icon"
        height="32"
        class="mr-2"
      >

      <div class="mx-3">
        <span class="font-weight-black text-outline subtitle-text carousel-text text-uppercase pg-letter-spacing" :style="{ '--bgColor': activityType.color }">
          {{ activityType.name }}
        </span>
      </div>
    </v-row>

    <v-row no-gutters justify="space-between">
      <patch
        v-for="patch in activityType.patches"
        :key="`activityType-${activityType.id}-patch-${patch.id}`"
        v-bind="{ patch }"
        class="mb-6"
        :unblocked="unblocked"
      />
    </v-row>
  </div>
</template>

<script>
import Patch from './Patch.vue'

export default {
  name: 'PatchRow',

  components: {
    Patch
  },

  props: {
    activityType: {
      type: Object,
      required: true
    },

    unblocked: {
      type: Object,
      required: true
    }
  }
}
</script>
