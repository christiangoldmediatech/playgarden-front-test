<template>
  <div>
    <v-card>
      <div>
        <div>
          <div>
            <v-card class="image-worksheet">
              <v-img
                :src="image.image"
              />
            </v-card>
          </div>
        </div>
        <p class="text-center">
          <span class="font-weight-bold">User Answers</span><br>
          <label class="display-3 font-weight-bold total-users">0</label>
          <br>
          <span>Clics</span>
        </p>
      </div>
    </v-card>
  </div>
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
