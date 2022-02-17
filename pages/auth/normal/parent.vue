<template>
  <v-row no-gutters>
    <!-- BACK BUTTON -->
    <v-col cols="12" class="mb-4">
      <v-btn color="accent" nuxt text>
        <a
          class="d-block accent--text mb-1 mt-6"
          href="https://playgardenonline.com/"
        >
          <v-icon left>
            mdi-less-than
          </v-icon>
          Back
        </a>
      </v-btn>
    </v-col>

    <!-- STEP ONE -->
    <v-col cols="12">
      <step-one />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { useGtmHelper } from '@/composables'
import StepOne from '@/components/app/register/StepOne.vue'

export default defineComponent({
  name: 'Parent',

  components: {
    StepOne
  },

  setup() {
    const gtm = useGtmHelper()

    gtm.push({
      event: 'parent_page',
      conversionID: '959213252',
      conversionLabel: 'QAn5COr85PoBEMTdsckD'
    })
  }
})
</script>
