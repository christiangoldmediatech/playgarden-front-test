<template>
  <div class="pg-flex pg-w-full pg-justify-center pg-items-center">
    <div class="pg-w-3/4 md:pg-w-2/6 pg-m-auto">
      <v-img
        alt="Rainbow Loading Indicator"
        contain
        :src="require('assets/gif/Rainbow.gif')"
      />

      <v-img
        alt="Playarden Prep Online Logo"
        contain
        :src="require('assets/svg/logo.svg')"
      />
    </div>

    <nuxt v-if="nuxt" />
  </div>
</template>

<script>
export default {
  name: 'PgLoading',

  props: {
    nuxt: Boolean
  }
}
</script>
