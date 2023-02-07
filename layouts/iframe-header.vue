<template>
  <v-app>
    <iframe
      src="https://playgardenonline.com/empty-header?header-iframe=true"
      height="250"
    />

    <v-main>
      <v-container class="pa-0">
        <nuxt />
      </v-container>
    </v-main>

    <default-footer />
  </v-app>
</template>

<script>
import DefaultFooter from '@/components/app/footer/DefaultFooter.vue'

export default {
  name: 'IframeHeader',
  components: { DefaultFooter }
}
</script>

<style scoped>
iframe {
  border: unset;
}
</style>
