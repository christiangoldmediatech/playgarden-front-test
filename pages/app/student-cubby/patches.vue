<template>
  <div>
    <patch-overlay />

    <v-card flat>
      <v-card-text>
        <study-cubby-item-header v-bind="studentChubbyItemHeaderProps" />

        <patch-row
          v-for="activityType in childrenPatchesActivity"
          :key="`activity-type-patch-row-${activityType.id}`"
          :activity-type="activityType"
          data-test-id="patch-row"
        />
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, useRoute, useStore, useRouter, computed } from '@nuxtjs/composition-api'
import { usePatches } from '@/composables/patches'
import PatchRow from '@/components/app/student-cubby/PatchRow.vue'
import PatchOverlay from '@/components/app/student-cubby/PatchOverlay.vue'
import { useChildRoute } from '@/composables'
import { TypedStore } from '@/models'
import { watch } from '@vue/composition-api'
import { useStudentCubbyHelpers } from '@/components/app/student-cubby/composables'
import StudyCubbyItemHeader, { StudentCubbyItemHeaderProps } from '@/components/app/student-cubby/StudyCubbyItemHeader.vue'
import { StudentChubbyItemText } from '@/components/app/student-cubby/types'

const itemText: StudentChubbyItemText = 'PATCHES'

export default defineComponent({
  name: 'Patches',

  components: {
    PatchRow,
    PatchOverlay,
    StudyCubbyItemHeader
  },

  setup () {
    const route = useRoute()
    const store = useStore<TypedStore>()
    const router = useRouter()
    const { childId: studentId } = useChildRoute({ store, route, router })
    const { childrenPatchesActivity, getPatchesByChildId } = usePatches()
    const { getStudentChubbyItemFromItemText } = useStudentCubbyHelpers()

    watch(studentId, async () => {
      await getPatchesByChildId(studentId.value || 0)
    }, { immediate: true })

    const studentChubbyItemHeaderProps = computed((): StudentCubbyItemHeaderProps => {
      return {
        studentCubbyItem: getStudentChubbyItemFromItemText(itemText)
      }
    })

    return {
      childrenPatchesActivity,
      studentId,
      itemText,
      studentChubbyItemHeaderProps
    }
  }
})
</script>
