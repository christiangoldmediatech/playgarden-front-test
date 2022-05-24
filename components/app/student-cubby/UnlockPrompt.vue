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
      <PlanUpgradePrompt />
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from '@nuxtjs/composition-api'
import PlanUpgradePrompt from '@/components/app/payment/PlanUpgradePrompt.vue'
import StudyCubbyItemHeader, { StudentCubbyItemHeaderProps } from './StudyCubbyItemHeader.vue'
import { useStudentCubbyHelpers } from './composables'
import type { StudentCubbyItem } from './types'

export interface UnlockPromptProps {
  blockedItem: StudentCubbyItem
}

export default defineComponent({
  name: 'UnlockPrompt',
  components: {
    StudyCubbyItemHeader,
    PlanUpgradePrompt
  },
  props: {
    blockedItem: {
      type: Object as PropType<UnlockPromptProps['blockedItem']>
    }
  },
  setup(props) {
    const StudentCubbyHelpers = useStudentCubbyHelpers()

    const studentChubbyItemHeaderProps = computed<StudentCubbyItemHeaderProps>(() => {
      return {
        studentCubbyItem: props.blockedItem,
        isHeaderAlwaysVisible: true
      }
    })

    const itemDescription = computed(() => StudentCubbyHelpers.getItemDescription(props.blockedItem?.text))
    const imagePath = computed(() => {
      const imageName = props.blockedItem?.imgName
      return imageName ? require(`@/assets/png/student-cubby/${imageName}`) : null
    })

    return {
      imagePath,
      itemDescription,
      studentChubbyItemHeaderProps
    }
  }
})
</script>

<style lang="scss" scoped>
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
</style>
