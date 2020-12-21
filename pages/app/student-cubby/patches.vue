<template>
  <div>
    <patch-overlay />

    <v-card flat class="pt-0 pt-md-3">
      <v-card-text class="pt-0 pt-md-4">
        <div class="text-center">
          <underlined-title
            class="text-h5 text-md-h3"
            text="Earn Activity Patches for learning!"
          />

          <p class="mt-2">
            Master subjects in the Activities section to collect patches for
            your Student Cubby! Collect all badges to receive a real patch for
            your backpack.
          </p>
        </div>

        <patch-row
          v-for="activityType in items"
          :key="`activity-type-patch-row-${activityType.id}`"
          :activity-type="activityType"
        />
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { get } from 'lodash'
import { mapActions } from 'vuex'

import PatchRow from '@/components/app/student-cubby/PatchRow.vue'
import PatchOverlay from '@/components/app/student-cubby/PatchOverlay.vue'

export default {
  name: 'Patches',

  components: {
    PatchRow,
    PatchOverlay
  },

  data () {
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
  }
}
</script>
