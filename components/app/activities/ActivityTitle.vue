<template>
  <v-row justify="center">
    <v-col class="text-center" cols="12" lg="9">
      <p class="text-h3">
        <span class="title-text">
          Master subjects to collect patches for your Student Cubby!
        </span>
      </p>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'ActivityTitle',

  data: () => {
    return {}
  }
}
</script>

<style lang="scss" scoped>
.title-text {
  width: calc(100%);
  background-image: linear-gradient(transparent calc(100% - 10px), var(--v-primary-base) 10px);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  color: var(--v-black-base);
}
</style>
