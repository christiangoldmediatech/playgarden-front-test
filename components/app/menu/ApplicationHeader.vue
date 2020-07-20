<template>
  <span>
    <v-navigation-drawer v-model="drawer" app temporary>
      <v-col cols="12">
        <v-row class="pr-3" justify="end">
          <v-btn icon @click.stop="drawer = !drawer">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-row>

        <menu-list @item-clicked="drawer = false" />
      </v-col>

      <template v-slot:append>
        <v-col cols="12">
          <v-row>
            <template v-if="isUserLoggedIn">
              <v-col cols="12">
                <v-btn block color="primary" nuxt :to="{ name: 'app-account' }">
                  ACCOUNT SETTINGS
                </v-btn>
              </v-col>

              <v-col cols="12">
                <v-btn
                  block
                  class="mb-3"
                  color="accent"
                  text
                  :to="{ name: 'auth-logout' }"
                >
                  LOG OUT
                </v-btn>
              </v-col>
            </template>

            <v-col v-else cols="12">
              <v-btn
                block
                class="mb-3"
                color="primary"
                nuxt
                text
                :to="{ name: 'auth-login' }"
              >
                LOG IN
              </v-btn>
            </v-col>
          </v-row>

          <menu-list
            class="mb-3"
            in-append-drawer
            @item-clicked="drawer = false"
          />
        </v-col>
      </template>
    </v-navigation-drawer>

    <v-app-bar
      app
      class="app-bar"
      :class="{ mobile: $vuetify.breakpoint.smAndDown }"
      color="white"
      :extension-height="$vuetify.breakpoint.mdAndUp ? 100 : 0"
      flat
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
          :to="{ name: isUserLoggedIn ? 'app-account' : 'auth-login' }"
        >
          <template v-if="isUserLoggedIn">
            ACCOUNT

            <v-icon right>mdi-cog-outline</v-icon>
          </template>

          <template v-else>
            LOGIN
          </template>
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

  computed: mapGetters('auth', ['isUserLoggedIn']),

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
