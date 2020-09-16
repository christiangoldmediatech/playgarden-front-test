<template>
  <div>
    <v-row align="end">
      <img
        :src="activityType.icon"
        :height="$vuetify.breakpoint.xs ? '32px' : '48px'"
      >

      <div class="mx-3">
        <span class="font-weight-black text-outline subtitle-text carousel-text text-uppercase pg-letter-spacing" :style="{ '--bgColor': activityType.color }">
          {{ activityType.name }}
        </span>
      </div>
    </v-row>

    <v-row>
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
