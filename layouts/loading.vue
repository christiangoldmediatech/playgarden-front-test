<template>
  <v-app>
    <!-- CONTENT -->
    <v-main>
      <v-container fill-height fluid>
        <nuxt />
      </v-container>
    </v-main>

    <!-- FOOTER -->
    <v-footer app>
      <span>&copy; {{ new Date().getFullYear() }} </span>
    </v-footer>

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
