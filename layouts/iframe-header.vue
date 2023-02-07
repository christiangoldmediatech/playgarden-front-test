<template>
  <v-app>
    <iframe
      src="https://playgardenonline.com/empty-header?header-iframe=true"
      height="250"
      @mouseenter="onMouseIn"
      @mouseleave="onMouseLeave"
    />

    <div class="pg-h-32"></div>

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
  components: { DefaultFooter },
  methods: {
    onMouseIn(e) {
      e.target.style.height = '100vh'
    },
    onMouseLeave(e) {
      e.target.style.height = ''
    }
  }
}
</script>

<style scoped>
iframe {
  border: unset;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10;
}
</style>
