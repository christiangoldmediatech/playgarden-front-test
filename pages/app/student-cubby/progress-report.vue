<template>
  <div>
    <v-card flat>
      <v-card-text>
        <StudyCubbyItemHeader v-bind="studentChubbyItemHeaderProps" />
        <dashboard />
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from '@nuxtjs/composition-api'
import Dashboard from '@/components/app/progress-report/Dashboard.vue'
import StudyCubbyItemHeader, { StudentCubbyItemHeaderProps } from '@/components/app/student-cubby/StudyCubbyItemHeader.vue'
import { useStudentCubbyHelpers } from '@/components/app/student-cubby/composables'
import type { StudentChubbyItemText } from '@/components/app/student-cubby/types'

const itemText: StudentChubbyItemText = 'PROGRESS REPORT'

export default defineComponent({
  name: 'ProgressReport',

  components: {
    Dashboard,
    StudyCubbyItemHeader
  },
  setup() {
    const { getStudentChubbyItemFromItemText } = useStudentCubbyHelpers()

    const studentChubbyItemHeaderProps = computed((): StudentCubbyItemHeaderProps => {
      return {
        studentCubbyItem: getStudentChubbyItemFromItemText(itemText)
      }
    })

    return {
      studentChubbyItemHeaderProps
    }
  }
})
</script>

<style lang="scss" scoped>
.progress-report {
  &-container {
    width: 100%;
  }
}
</style>
