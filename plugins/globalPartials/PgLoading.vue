<template>
  <v-row align="center" fill-height justify="center" no-gutters>
    <v-col class="text-center" cols="auto">
      <div class="mb-3">
        <v-img
          alt="Playarden Prep Online Logo"
          contain
          class="logo-img"
          :src="require('@/assets/svg/logo.svg')"
        />
      </div>

      <v-progress-linear color="primary" indeterminate :size="20" />

      <nuxt v-if="nuxt" />
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'PgLoading',

  props: {
    nuxt: Boolean
  }
}
</script>
