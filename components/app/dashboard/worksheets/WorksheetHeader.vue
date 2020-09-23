<template>
  <!-- Title and Progress Bar -->
  <v-col class="d-flex flex-column justify-end flex-shrink-0 flex-grow-1" cols="12">
    <div class="worksheet-title">
      ONLINE WORKSHEET
    </div>
    <v-row class="flex-shrink-1 flex-grow-0 mx-0" justify="center" no-gutters>
      <v-col cols="7" sm="4" lg="3" xl="2">
        <!-- Progress Bar -->
        <v-row no-gutters>
          <v-col cols="12">
            <v-progress-linear
              background-color="#F4EFEF"
              height="13"
              rounded
              :value="progress"
            />
          </v-col>
          <!-- Steps -->
          <v-col
            v-for="i in stepCount"
            :key="`question-marker-${i}`"
            class="text-center"
          >
            <span :class="['worksheet-step', { 'primary--text': step >= i }]">
              {{ i }}
            </span>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
import WorksheetComputedMixin from '@/mixins/WorksheetComputedMixin.js'

export default {
  name: 'WorksheetHeader',
  mixins: [WorksheetComputedMixin],
  props: {
    step: {
      type: Number,
      required: true
    }
  }
}
</script>

<style lang="scss">
.worksheet {
  &-title {
    font-size: 28px;
    font-weight: bold;
    letter-spacing: 0.15em;
    text-align: center;
  }
  &-step {
    font-size: 18px;
    font-weight: bold;
    color: #D2D2D2 !important;
  }
}
</style>
