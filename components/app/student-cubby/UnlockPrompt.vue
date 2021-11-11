<template>
  <div
    v-if="blockedItem"
    class="overlay"
  >
    <main class="overlay overlayContent">
      <v-container class="pt-0 pt-md-3">
        <StudyCubbyItemHeader
          v-bind="studentChubbyItemHeaderProps"
          class="mt-4 px-2 px-md-4"
        />
      </v-container>
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
            To unlock
          </div>
          <div
            class="accent--text fw-700 text-decoration-underline cursor-pointer"
            @click="handleUpgradeRequest"
          >
            Upgrade your Plan
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from '@nuxtjs/composition-api'
import { useStudentCubbyHelpers } from './composables'
import StudyCubbyItemHeader, { StudentCubbyItemHeaderProps } from './StudyCubbyItemHeader.vue'
import type { StudentCubbyItem } from './types'

export interface UnlockPromptProps {
  blockedItem: StudentCubbyItem
}

export default defineComponent({
  name: 'UnlockPrompt',
  components: {
    StudyCubbyItemHeader
  },
  props: {
    blockedItem: {
      type: Object as PropType<UnlockPromptProps['blockedItem']>
    }
  },
  setup(props) {
    const { getItemDescription, displayPlanUpgradeModal } = useStudentCubbyHelpers()

    const studentChubbyItemHeaderProps = computed((): StudentCubbyItemHeaderProps => {
      return {
        studentCubbyItem: props.blockedItem,
        isHeaderAlwaysVisible: true
      }
    })

    const itemDescription = computed(() => getItemDescription(props.blockedItem?.text))
    const imagePath = computed(() => {
      const imageName = props.blockedItem?.imgName
      return imageName ? require(`@/assets/png/student-cubby/${imageName}`) : null
    })

    function handleUpgradeRequest() {
      displayPlanUpgradeModal()
    }

    return {
      imagePath,
      itemDescription,
      studentChubbyItemHeaderProps,
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

.overlay {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgb(0, 0, 0, 0.6);
  z-index: 6;
  min-height: 500px;
}

.overlayContent {
  // Keep the z-index of this element less than 8 as
  // .v-menu__content has z-index of 8 and it should show on the top of this element
  z-index: 7;
  background-color: #80808000;
  color: white;
}

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
