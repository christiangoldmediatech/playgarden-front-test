<template>
  <v-app>
    <!-- CONTENT -->
    <v-main>
      <v-container fill-height fluid>
        <pg-loading-screen />
      </v-container>
    </v-main>

    <notify-event />
  </v-app>
</template>

<script>
import PgLoadingScreen from '@/components/pg/components/PgLoadingScreen.vue'

export default {
  name: 'Loading',
  components: { PgLoadingScreen }
}
</script>

<style lang="scss" scoped>
.logo-img {
  padding-top: 8px;
  width: 200px;
}
</style>
