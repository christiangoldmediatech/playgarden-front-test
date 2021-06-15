<template>
  <v-card class="content-dashboard">
    <v-card-title>
      <v-img
        :src="image.image"
        height="156"
      />
    </v-card-title>
    <v-card-text>
      <p class="text-center">
        <img v-if="image.is_correct" height="30px;" src="@/assets/svg/ok.svg">
        <img v-else height="30px;" src="@/assets/svg/fail.svg">
        <br>
        <span class="font-weight-bold">User Answers</span><br>
        <label class="display-3 font-weight-bold total-users">0</label>
        <br>
        <span>Clicks {{ image.code }}</span>
      </p>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'OwImage',

  props: {
    image: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.total-users {
  color: var(--v-accent-base) !important;
}
.image-worksheet {
    /* position:static; */
}
</style>
