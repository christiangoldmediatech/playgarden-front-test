<template>
  <!-- Question & Random Word -->
  <v-col class="flex-shrink-1 flex-grow-0 pb-0" cols="12">
    <div class="worksheet-question">
      {{ question }}
    </div>
    <div v-if="connectingPairs" class="worksheet-word pt-2">
      {{ randomWord }}
    </div>
  </v-col>
</template>

<script>
import WorksheetComputedMixin from '@/mixins/WorksheetComputedMixin.js'

export default {
  name: 'WorksheetQuestion',
  mixins: [WorksheetComputedMixin],
  props: {
    step: {
      type: Number,
      required: true
    },
    randomWord: {
      validator: (val) => {
        return typeof val === 'string' || val === null
      },
      required: true
    }
  }
}
</script>

<style lang="scss">
.worksheet {
  &-question {
    font-size: 20px;
    font-weight: medium;
    text-align: center;
  }
  &-word {
    font-size: 28px;
    font-weight: bold;
    text-align: center;
  }
}
</style>
