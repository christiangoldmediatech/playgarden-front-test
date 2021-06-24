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
        />
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed, useRoute, useStore } from '@nuxtjs/composition-api'
// import { mapActions } from 'vuex'

import { usePatches } from '@/composables/patches'
import PatchRow from '@/components/app/student-cubby/PatchRow.vue'
import PatchOverlay from '@/components/app/student-cubby/PatchOverlay.vue'

export default {
  name: 'Patches',

  components: {
    PatchRow,
    PatchOverlay
  },

  setup () {
    const route = useRoute()
    const store = useStore()
    const studentId = computed(() => Number(route.value.query.id))
    const { childrenPatchesActivity, getPatchesByChildId } = usePatches()
    onMounted(async () => {
      await getPatchesByChildId(studentId.value)
    })

    return {
      childrenPatchesActivity,
      studentId
    }
  }

  /* data () {
    return {
      items: []
    }
  },

  computed: {
    studentId () {
      return this.$route.query.id
    }
  },

  watch: {
    studentId () {
      this.refresh()
    }
  },

  created () {
    this.refresh()
  },

  methods: {
    ...mapActions('children/patches', ['getPatchesByChildId']),

    async refresh () {
      if (this.studentId) {
        this.items = (
          await this.getPatchesByChildId({ id: this.studentId })
        ).filter(item => get(item, 'patches', []).length)
      }
    }
  } */
}
</script>
