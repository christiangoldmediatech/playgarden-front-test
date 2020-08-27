<template>
  <v-app>
    <!-- CONTENT -->
    <v-main>
      <v-container fill-height fluid>
        <v-row align="center" fill-height justify="center">
          <v-col class="text-center" cols="4">
            <div>
              <img class="logo-img" src="@//assets/svg/logo.svg">
            </div>

            <v-progress-linear color="primary" indeterminate :size="20" />

            <nuxt />
          </v-col>
        </v-row>
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
