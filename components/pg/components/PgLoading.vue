<template>
  <transition name="fade-loading" mode="out-in">
    <div v-if="loading" class="loading-container" :class="{ fullscreen }">
      <div>
        <v-img
          class="pg-m-auto"
          width="85%"
          max-width="400px"
          alt="Rainbow Loading Indicator"
          contain
          :src="require('assets/gif/Rainbow.gif')"
        />

        <v-img
          class="pg-m-auto"
          width="85%"
          max-width="400px"
          alt="Playarden Prep Online Logo"
          contain
          :src="require('assets/svg/playgardenprep.svg')"
        />
      </div>
    </div>
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
    },
    fullscreen: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped lang="scss">
.fade-loading-enter-active,
.fade-loading-leave-active {
  transition: opacity 0.2s ease;
}
.fade-loading-enter,
.fade-loading-leave-to {
  opacity: 0;
}
.loading-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.fullscreen {
  padding: 128px 0 0 0;
  @media screen and (max-width: 960px) {
    padding: 56px 0 8px 0;
  }
}
</style>
