<template>
  <v-app>
    <!-- CONTENT -->
    <v-main>
      <v-container fill-height fluid>
        <pg-loading nuxt />
      </v-container>
    </v-main>

    <notify-event />
  </v-app>
</template>

<script>
// import PgLoading from '@/components/pg/components/PgLoading.vue'

export default {
  name: 'Loading'

  // components: {
  //   PgLoading
  // }
}
</script>

<style lang="scss" scoped>
.logo-img {
  padding-top: 8px;
  width: 200px;
}
</style>
