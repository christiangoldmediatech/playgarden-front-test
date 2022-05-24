<template>
  <div v-if="studentCubbyItem">
    <template v-if="!isItemUnavailable || isHeaderAlwaysVisible">
      <div class="d-flex align-center justify-center">
        <img
          :height="studentCubbyItem.imageHeight"
          :src="imagePath"
        >
        <div class="ml-4 text-h4 text-md-h3">
          {{ itemText }}
        </div>
      </div>
      <div class="my-6 text-md-h6 text-body-1 text-center">
        {{ itemDescription }}
      </div>
    </template>
    <div
      v-else
      class="placeholderElement"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from '@nuxtjs/composition-api'
import { StudentCubbyItem } from './types'
import { useStudentCubbyHelpers } from './composables'
import { usePlanAccessHelpers } from '~/composables'

export interface StudentCubbyItemHeaderProps {
  studentCubbyItem: StudentCubbyItem | undefined
  isHeaderAlwaysVisible?: boolean
}

export default defineComponent({
  name: 'StudentCubbyItemHeader',
  props: {
    studentCubbyItem: {
      type: Object as PropType<StudentCubbyItemHeaderProps['studentCubbyItem']>
    },
    isHeaderAlwaysVisible: {
      type: Boolean as PropType<StudentCubbyItemHeaderProps['isHeaderAlwaysVisible']>
    }
  },
  setup(props) {
    const PlanAccessHelpers = usePlanAccessHelpers()
    const StudentCubbyHelpers = useStudentCubbyHelpers()

    const itemText = computed(() => props.studentCubbyItem?.text)
    const isItemUnavailable = computed(() => PlanAccessHelpers.isItemUnAvailableForCurrentUser(itemText.value))
    const itemDescription = computed(() => StudentCubbyHelpers.getItemDescription(itemText.value))

    const imagePath = computed(() => {
      const imageName = props.studentCubbyItem?.imgName
      return imageName ? require(`@/assets/png/student-cubby/${imageName}`) : null
    })

    return {
      itemText,
      isItemUnavailable,
      itemDescription,
      imagePath
    }
  }
})

</script>

<style lang="scss" scoped>
.placeholderElement {
  height: 200px;
}
</style>
