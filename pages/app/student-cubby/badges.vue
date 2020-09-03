<template>
  <v-card flat>
    <v-card-text>
      <div class="text-center">
        <span class="text-h3 title-text">
          Earn Activity Patches for learning!
        </span>

        <p class="mt-5">
          Master subjects in the Activities section to collect patches for your
          Student Cubby! Collect all badges to receive a real patch for your
          backpack.
        </p>
      </div>

      <patch-row
        v-for="activityType in items"
        :key="`activity-type-patch-row-${activityType.id}`"
        :activity-type="activityType"
        :unblocked="unblocked"
      />
    </v-card-text>

    <patch-overlay :unblocked="unblocked" />
  </v-card>
</template>

<script>
import { mapActions } from 'vuex'

import PatchRow from '@/components/app/student-cubby/PatchRow.vue'
import PatchOverlay from '@/components/app/student-cubby/PatchOverlay.vue'

export default {
  name: 'Badges',

  components: {
    PatchRow,
    PatchOverlay
  },

  data () {
    return {
      activityTypes: [],
      patches: [],
      unblocked: {}
    }
  },

  computed: {
    studentId () {
      return this.$route.query.id
    },

    items () {
      return this.activityTypes.map((type) => {
        const patches = this.patches.filter(
          patch => patch.activityType.id === type.id
        )
        return {
          ...type,
          patches
        }
      })
    }
  },

  watch: {
    studentId () {
      this.fetchChildPatches()
    }
  },

  created () {
    this.refresh()
  },

  methods: {
    ...mapActions('admin/activity', ['getTypes']),

    ...mapActions('patches', ['getPatches']),

    ...mapActions('children/patches', ['getPatchesByChildId']),

    async fetchChildPatches () {
      const unblocked = {}
      const data = await this.getPatchesByChildId({ id: this.studentId })

      data.map(({ id }) => (unblocked[id] = 1))

      this.unblocked = unblocked
    },

    async refresh () {
      const results = await Promise.all([this.getTypes(), this.getPatches()])

      this.activityTypes = results[0]
      this.patches = results[1]

      if (this.studentId) {
        await this.fetchChildPatches()
      }
    }
  }
}
</script>
