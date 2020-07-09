<template>
  <v-row no-gutters>
    <v-col class="hidden-sm-and-down" cols="12" md="6">
      <div class="image">
        <img alt="Smiling Girl Picture" src="@/assets/svg/girl-smiling.svg">
      </div>
    </v-col>

    <v-col cols="12" md="6">
      <div class="form mx-auto px-4">
        <div>
          <underlined-title text="Welcome Back" />
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'Dashboard'
}
</script>

<style lang="scss" scoped>
.image {
  height: 100%;
  max-height: 500px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-content: center;
  img {
    height: 100%;
  }
}
</style>
