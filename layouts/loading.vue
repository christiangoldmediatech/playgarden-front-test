<template>
  <v-app>
    <!-- CONTENT -->
    <v-main>
      <v-container fluid fill-height>
        <nuxt />
      </v-container>
    </v-main>
    <!-- FOOTER -->
    <v-footer app>
      <span>&copy; {{ new Date().getFullYear() }} </span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
}
</script>

<style lang="scss" scoped>
.logo-img {
  padding-top: 8px;
  width: 200px;
}
</style>
