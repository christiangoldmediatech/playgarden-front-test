<template>
  <section class="unlockBadge">
    <div class="circle ring-1" />
    <div class="circle ring-2" />
    <div class="circle core d-flex flex-column align-center justify-center">
      <v-icon
        color="grey darken-3"
        size="65px"
      >
        mdi-lock-outline
      </v-icon>
      <div class="pg-grey--text my-2 fw-700">
        {{ $t('dailyLessons.unlockPrompt.unlock') }}
      </div>
      <div
        class="accent--text fw-700 text-decoration-underline cursor-pointer"
        @click="handleUpgradeRequest"
      >
        {{ $t('dailyLessons.unlockPrompt.upgrade') }}
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, useStore, useRoute, useRouter } from '@nuxtjs/composition-api'
import { TypedStore } from '@/models'
import { usePlanAccessHelpers } from '~/composables'

export default defineComponent({
  name: 'PlanUpgradePrompt',
  setup() {
    const store = useStore<TypedStore>()
    const route = useRoute()
    const router = useRouter()
    const PlanAccessHelpers = usePlanAccessHelpers({ store, route, router })

    function handleUpgradeRequest() {
      PlanAccessHelpers.displayPlanUpgradeModal()
    }

    return {
      handleUpgradeRequest
    }
  }
})
</script>

<style lang="scss" scoped>
$outerCircleSize: 250px;
$circleSizeDifference: 20px;

$ring2Size: calc(#{$outerCircleSize} - #{$circleSizeDifference});
$coreSize: calc(#{$outerCircleSize} - 2 * #{$circleSizeDifference});

.unlockBadge {
  position: relative;
}

.circle {
  width: $outerCircleSize;
  height: $outerCircleSize;
  border-radius: 50%;
  position: absolute;
  left: 0;
  right: 0;
  margin: 0 auto;
}

.ring-1 {
  background-color: var(--v-primary-base);
}

.ring-2 {
  top: calc(#{$circleSizeDifference} / 2);
  width: $ring2Size;
  height: $ring2Size;
  background-color: var(--v-secondary-base);
}

.core {
  top: $circleSizeDifference;
  width: $coreSize;
  height: $coreSize;
  background-color: white;
}
</style>
