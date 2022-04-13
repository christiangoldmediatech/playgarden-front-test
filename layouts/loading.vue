<template>
  <v-app>
    <!-- CONTENT -->
    <v-main>
      <v-container fill-height fluid>
        <pg-loading-screen nuxt />
      </v-container>
    </v-main>

    <notify-event />
  </v-app>
</template>

<script>
export default {
  name: 'Loading'
}
</script>

<style lang="scss" scoped>
.logo-img {
  padding-top: 8px;
  width: 200px;
}
</style>
