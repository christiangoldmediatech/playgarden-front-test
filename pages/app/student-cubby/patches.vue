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
            Master subjects to collect patches for your Student Cubby! Collect
            all 5 patches in a category to receive a real patch for your
            backpack.
          </div>
        </div>

        <pg-loading :loading="loading">
          <div>
            <patch-row
              v-for="activityType in childrenPatchesActivity"
              :key="`activity-type-patch-row-${activityType.id}`"
              :activity-type="activityType"
              data-test-id="patch-row"
            />
          </div>
        </pg-loading>
      </v-card-text>
      <unlock-prompt
        v-if="hasUserLearnAndPlayPlan"
        title="PATCHES"
        desc="Master subjects in the Activities section to collect patches for your Student Cubby! Collect all badges to receive a real patch for your backpack."
        img="student-cubby/patches.svg"
      />
    </v-card>
  </div>
</template>

<script lang="ts">
import {
  useRoute,
  useStore,
  useRouter,
  ref,
  computed
} from '@nuxtjs/composition-api'
import { usePatches } from '@/composables/patches'
import PatchRow from '@/components/app/student-cubby/PatchRow.vue'
import PatchOverlay from '@/components/app/student-cubby/PatchOverlay.vue'
import { useChildRoute } from '@/composables'
import { TypedStore } from '@/models'
import { watch } from '@vue/composition-api'
import StudyCubbyItemHeader, {
  StudentCubbyItemHeaderProps
} from '@/components/app/student-cubby/StudyCubbyItemHeader.vue'
import { StudentChubbyItemText } from '@/components/app/student-cubby/types'
import { useStudentCubbyHelpers } from '@/components/app/student-cubby/composables'
import UnlockPrompt from '@/components/app/all-done/UnlockPrompt.vue'

export default {
  name: 'Patches',

  components: {
    PatchRow,
    PatchOverlay,
    UnlockPrompt
  },

  setup() {
    const route = useRoute()
    const store = useStore<TypedStore>()
    const router = useRouter()
    const { childId: studentId } = useChildRoute({ store, route, router })
    const { childrenPatchesActivity, getPatchesByChildId } = usePatches()

    const hasUserLearnAndPlayPlan = computed(() => {
      return store.getters['auth/hasUserLearnAndPlayPlan']
    })

    const loading = ref(true)
    watch(
      studentId,
      async () => {
        loading.value = true
        await getPatchesByChildId(studentId.value || 0)
        loading.value = false
      },
      { immediate: true }
    )

    return {
      loading,
      childrenPatchesActivity,
      studentId,
      hasUserLearnAndPlayPlan
    }
  }
}
</script>
