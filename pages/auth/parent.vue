<template>
  <v-row>
    <v-col cols="12">
      <v-btn
        color="accent"
        nuxt
        text
      >
        <a
          class="d-block accent--text mb-1 mt-1"
          href="https://playgardenonline.com/"
        >
          <v-icon left>
            mdi-less-than
          </v-icon>
          Back
        </a>
      </v-btn>
    </v-col>
    <v-col cols="12">
      <step-one />
    </v-col>
  </v-row>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import StepOne from '@/components/app/register/StepOne'
import { useGtmHelper } from '@/composables'

export default defineComponent({
  name: 'Parent',

  components: {
    StepOne
  },

  setup () {
    const gtm = useGtmHelper()

    gtm.push({
      event: 'parent_page',
      conversionID: '959213252',
      conversionLabel: 'QAn5COr85PoBEMTdsckD'
    })
  }
})
</script>
