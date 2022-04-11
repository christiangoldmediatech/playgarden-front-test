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
            Master subjects to collect patches for your Student Cubby! Collect all 5 patches in a category to receive a real patch for your backpack.
          </div>
        </div>

        <pg-loading v-if="loading" />
        <template v-else>
          <patch-row
            v-for="activityType in childrenPatchesActivity"
            :key="`activity-type-patch-row-${activityType.id}`"
            :activity-type="activityType"
            data-test-id="patch-row"
          />
        </template>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import { useRoute, useStore, useRouter, ref } from '@nuxtjs/composition-api'
import { usePatches } from '@/composables/patches'
import PatchRow from '@/components/app/student-cubby/PatchRow.vue'
import PatchOverlay from '@/components/app/student-cubby/PatchOverlay.vue'
import { useChildRoute } from '@/composables'
import { TypedStore } from '@/models'
import { watch } from '@vue/composition-api'

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

    const loading = ref(true)
    watch(studentId, async () => {
      loading.value = true
      await getPatchesByChildId(studentId.value || 0)
      loading.value = false
    }, { immediate: true })

    return {
      loading,
      childrenPatchesActivity,
      studentId
    }
  }
}
</script>
