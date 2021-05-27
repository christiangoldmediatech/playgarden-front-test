<template>
  <div>
    <patch-overlay />

    <v-card flat class="pt-0 pt-md-3">
      <v-card-text class="pt-0 pt-md-4">
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
