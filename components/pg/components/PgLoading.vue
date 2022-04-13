<template>
  <transition name="fade-loading" mode="out-in">
    <v-row v-if="loading" no-gutters class="fill-height" justify="center" align="center">
      <v-col align-self="center">
        <v-container fill-height fluid>
          <div class="pg-m-auto pg-py-10 md:pg-py-0 md:pg-w-auto">
            <v-img
              max-width="400px"
              alt="Rainbow Loading Indicator"
              contain
              :src="require('assets/gif/Rainbow.gif')"
            />

            <v-img
              max-width="400px"
              alt="Playarden Prep Online Logo"
              contain
              :src="require('assets/svg/logo.svg')"
            />
          </div>
        </v-container>
      </v-col>
    </v-row>
    <slot v-else />
  </transition>
</template>

<script>
export default {
  name: 'PgLoading',
  props: {
    loading: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style scoped>
.fade-loading-enter-active, .fade-loading-leave-active {
  transition: opacity .2s ease;
}
.fade-loading-enter, .fade-loading-leave-to {
  opacity: 0;
}
</style>
