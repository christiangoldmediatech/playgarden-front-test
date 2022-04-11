<template>
  <v-row no-gutters class="fill-height" justify="center" align="center">
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

        <nuxt v-if="nuxt" />
      </v-container>
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
