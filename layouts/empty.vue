<template>
  <v-app class="transparent-layout">
    <v-main>
      <v-container fluid class="pa-0">
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'Empty'
}
</script>

<style>
.transparent-layout {
  background-color: #00000000 !important;
}
</style>
