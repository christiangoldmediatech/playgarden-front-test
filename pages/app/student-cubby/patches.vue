<template>
  <div>
    <patch-overlay />

    <v-card flat>
      <v-card-text>
        <div class="text-center">
          <!-- Section Title and Description -->
          <div class="d-flex align-center justify-center">
            <img height="80px" src="@/assets/png/student-cubby/patches.svg">
            <span class="ml-4 text-h4 text-md-h3">PATCHES</span>
          </div>
          <div class="my-6 text-md-h6 text-body-1">
            Master subjects in the Activities section to collect patches for
            your Student Cubby! Collect all badges to receive a real patch for
            your backpack.
          </div>
        </div>

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
import { useRoute, useStore, useRouter } from '@nuxtjs/composition-api'
import { usePatches } from '@/composables/patches'
import PatchRow from '@/components/app/student-cubby/PatchRow.vue'
import PatchOverlay from '@/components/app/student-cubby/PatchOverlay.vue'
import { useChildRoute } from '@/composables'
import { TypedStore } from '@/models'
import { watch } from '@vue/composition-api'
import StudyCubbyItemHeader, { StudentCubbyItemHeaderProps } from '@/components/app/student-cubby/StudyCubbyItemHeader.vue'
import { StudentChubbyItemText } from '@/components/app/student-cubby/types'
import { useStudentCubbyHelpers } from '@/components/app/student-cubby/composables'

export default {
  name: 'Patches',

  components: {
    PatchRow,
    PatchOverlay
  },

  setup () {
    const route = useRoute()
    const store = useStore<TypedStore>()
    const router = useRouter()
    const { childId: studentId } = useChildRoute({ store, route, router })
    const { childrenPatchesActivity, getPatchesByChildId } = usePatches()

    watch(studentId, async () => {
      await getPatchesByChildId(studentId.value || 0)
    }, { immediate: true })

    return {
      childrenPatchesActivity,
      studentId
    }
  }
}
</script>
