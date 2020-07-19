<template>
  <v-app>
    <!-- APP BAR -->
    <application-header />

    <!-- CONTENT -->
    <v-main>
      <v-container class="fill-height" fluid mt-6 mt-md-0 pa-0>
        <nuxt />
      </v-container>
    </v-main>

    <!-- FOOTER -->
    <default-footer class="mt-12" />

    <notify-event />
  </v-app>
</template>

<script>
import ApplicationHeader from '@/components/app/menu/ApplicationHeader'
import DefaultFooter from '@/components/app/footer/DefaultFooter'

export default {
  name: 'Default',

  middleware: ['checkJWT'],

  components: {
    ApplicationHeader,
    DefaultFooter
  }
}
</script>

<style lang="scss" scoped>
.v-application ::v-deep {
  .display-1,
  .display-2,
  .display-3,
  .display-4,
  .headline,
  .title,
  .subtitle-1,
  .subtitle-2,
  .body-1,
  .body-2,
  .caption,
  .overline,
  .text-h1,
  .text-h2,
  .text-h3,
  .text-h4,
  .text-h5,
  .text-h6 {
    font-family: "Poppins", sans-serif !important;
  }
}
</style>
