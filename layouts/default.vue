<template>
  <v-app class="pg-app">
    <!-- APP BAR -->
    <application-header />
    <!-- NAV DRAWER -->
    <!-- <v-navigation-drawer
      v-model="appDrawer"
      app
      temporary
      clipped
      fixed
      disable-resize-watcher
      :mobile-break-point="600"
      class="ff-app-drawer"
      :class="{ 'ff-app-drawer-sm': $vuetify.breakpoint.sm }"
    >
      <admin-list
        v-if="isAdminUser"
        @item-clicked="appDrawer = false"
      />
      <employer-menu-item-list
        v-else-if="isEmployerUser"
        @item-clicked="appDrawer = false"
      />
      <pro-list
        v-else-if="isProUser"
        @item-clicked="appDrawer = false"
      />
      <menu-item-list :items="menuItems" />
    </v-navigation-drawer> -->

    <!-- CONTENT -->
    <v-main>
      <v-container class="pg-app-container" fluid mt-6 mt-md-0 pa-0>
        <nuxt />
      </v-container>
    </v-main>
    <!-- FOOTER -->
    <default-footer />

    <notify-event />
  </v-app>
</template>

<script>
import ApplicationHeader from '@/components/app/menu/ApplicationHeader.vue'
import DefaultFooter from '@/components/app/DefaultFooter.vue'

export default {
  name: 'Default',

  middleware: ['checkJWT'],

  components: {
    ApplicationHeader,
    DefaultFooter
  },

  data () {
    return {
      appDrawer: false,
      title: 'Playgarden Prep',
      menuItems: [
        {
          title: 'Log out',
          click: this.logout
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>

.pg-app {
  height: 100%;
  margin: 0 auto;
  color: $pg-black;
  &-bar {
    z-index: 10;
  }
  &-container {
    position: relative;
    height: 100%;
  }
}
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
    font-family: 'Poppins', sans-serif !important;
  }
}
</style>
