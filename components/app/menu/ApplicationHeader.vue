<template>
  <span>
    <v-navigation-drawer v-model="drawer" app temporary>
      <v-col cols="12">
        <v-row>
          <v-spacer />

          <v-btn color="white" depressed tile @click.stop="drawer = !drawer">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-row>

        <menu-list @item-clicked="drawer = false" />
      </v-col>

      <template v-slot:append>
        <v-col cols="12">
          <v-row v-if="!userInfo.id">
            <v-col cols="12">
              <v-btn
                block
                class="mb-3"
                color="primary"
                :disabled="loading"
                nuxt
                text
                :to="{ name: 'auth-login' }"
              >
                LOG IN
              </v-btn>
            </v-col>
          </v-row>

          <menu-list append class="mb-3" @item-clicked="drawer = false" />
        </v-col>
      </template>
    </v-navigation-drawer>

    <v-app-bar
      app
      class="app-bar"
      :class="{ mobile: $vuetify.breakpoint.smAndDown }"
      color="white"
      elevate-on-scroll
      :extension-height="$vuetify.breakpoint.mdAndUp ? 100 : 0"
      :height="$vuetify.breakpoint.mdAndUp ? 120 : undefined"
    >
      <v-app-bar-nav-icon
        class="app-bar-nav-icon hidden-md-and-up primary white--text"
        tile
        x-large
        @click.stop="drawer = !drawer"
      />

      <v-row align="end" justify="center">
        <nuxt-link :to="{ name: 'index' }">
          <div class="logo">
            <img alt="Playgarden Prep's Logo" src="@/assets/svg/logo.svg">
          </div>
        </nuxt-link>

        <v-btn
          class="app-bar-action-btn hidden-sm-and-down"
          color="primary"
          nuxt
          :to="{ name: 'auth-login' }"
        >
          <span>Login</span>
        </v-btn>
      </v-row>

      <template v-slot:extension>
        <v-row v-if="$vuetify.breakpoint.mdAndUp" justify="center">
          <v-col cols="auto">
            <menu-list class="hidden-sm-and-down" horizontal />
          </v-col>
        </v-row>
      </template>
    </v-app-bar>
  </span>
</template>

<script>
import { mapGetters } from 'vuex'

import MenuList from '@/components/app/menu/MenuList'

export default {
  name: 'ApplicationHeader',

  components: {
    MenuList
  },

  data: () => ({
    drawer: false
  }),

  computed: mapGetters('auth', { userInfo: 'getUserInfo' }),

  watch: {
    '$vuetify.breakpoint.smAndDown' (v) {
      if (!v) {
        this.drawer = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.app-bar {
  ::v-deep .v-toolbar__content,
  ::v-deep .v-toolbar__extension {
    align-items: unset;
  }

  .app-bar-nav-icon {
    margin-left: -16px !important;
    height: 56px;
    width: 56px;
  }

  .logo {
    height: 75px;

    img {
      height: 100%;
    }
  }

  &.mobile {
    ::v-deep .v-toolbar__content,
    ::v-deep .v-toolbar__extension {
      align-items: center;
    }

    .logo {
      height: 45px;
    }
  }

  &-action-btn {
    position: absolute;
    right: 30px;
    top: 20px;
    width: 150px;
  }
}
</style>
