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
    <v-footer app class="pg-app-footer">
      <v-col cols="12">
        <span>&copy; {{ new Date().getFullYear() }} </span>
      </v-col>
    </v-footer>
    <!--
      Reusable snackbar component
      Usage: $store.commit('app/SET_GLOBAL_SNACKBAR', { ...options }) See options in store/app/mutations
    -->
    <!-- <v-snackbar
      :value="snack.show"
      bottom
      :color="snack.color"
      :multi-line="snack.multiline"
      :timeout="snack.timeout"
      @input="toggleSnack"
    >
      <span class="subtitle-1">{{ snack.text }}</span>
      <v-btn text @click.stop="snack.action">
        {{ snack.actionText }}
      </v-btn>
    </v-snackbar> -->

    <notify-event />
  </v-app>
</template>

<script>
import ApplicationHeader from '@/components/app/menu/ApplicationHeader.vue'

export default {
  name: 'Default',

  middleware: ['checkJWT'],

  components: {
    ApplicationHeader
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
.v-application {
  ::v-deep .text-h1, .text-h2, .text-h3, .text-h4, .text-h5, .text-h6 {
    font-family: 'Poppins', sans-serif !important;
  }
}
</style>
