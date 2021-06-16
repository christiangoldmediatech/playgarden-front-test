<template>
  <v-card class="content-dashboard">
    <v-card-title>
      <v-card class="card-image">
        <v-img
          :src="image.image"
          height="156"
        />
      </v-card>
    </v-card-title>
    <v-card-text class="mt-12">
      <p class="text-center pt-5">
        <img v-if="image.is_correct" height="30px;" src="@/assets/svg/ok.svg">
        <img v-else height="30px;" src="@/assets/svg/fail.svg">
        <br>
        <span class="font-weight-bold">User Answers</span><br>
        <label class="display-3 font-weight-bold total-users"> {{ clicks }}</label>
        <br>
        <span>Clicks</span>
      </p>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'OwImage',

  props: {
    image: {
      type: Object,
      required: true
    },
    clicks: {
      type: Number,
      required: true
    }
  }
})
</script>

<style lang="scss" scoped>
.total-users {
  color: var(--v-accent-base) !important;
}
.card-image {
  position: absolute !important;
  width: 85% !important;
}
</style>
