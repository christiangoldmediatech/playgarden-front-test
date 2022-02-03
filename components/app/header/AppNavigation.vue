<template>
  <v-navigation-drawer v-model="appDrawer" temporary app>
    <template v-slot:prepend>
      <v-row class="pr-3" justify="end">
        <v-btn icon @click.stop="appDrawer = !appDrawer">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-row>
    </template>

    <v-container fluid>
      <v-row no-gutters>
        <template v-for="(item, index) in items">
          <v-col
            v-if="item.external"
            :key="`${_uid}-drawer-item-${index}`"
            cols="12"
          >
            <v-btn
              class="list-item"
              exact
              nuxt
              text
              @click="openLink(item.link)"
            >
              {{ item.title }}
            </v-btn>
          </v-col>
          <v-col v-else :key="`${_uid}-drawer-item-${index}`" cols="12">
            <v-btn class="list-item" exact nuxt text :to="item.to">
              {{ item.title }}
            </v-btn>
          </v-col>
        </template>
      </v-row>
    </v-container>

    <template v-slot:append>
      <v-container fluid mb-6>
        <v-row>
          <v-col cols="12">
            <span class="font-weight-medium">First time using Playgarden?</span>
            <v-btn color="primary" nuxt text :to="{ name: 'app-onboarding' }">
              WATCH TUTORIAL HERE
            </v-btn>
          </v-col>

          <v-col v-if="isUserLoggedIn && !isUserInSignupProcess" cols="12">
            <v-btn
              block
              color="primary"
              nuxt
              :to="{ name: 'app-account-index' }"
            >
              ACCOUNT SETTINGS
            </v-btn>
          </v-col>

          <v-col v-if="isUserLoggedIn" class="pb-0" cols="12">
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

          <v-col v-else class="pb-0" cols="12">
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

        <v-row no-gutters>
          <v-col
            v-for="(item, index) in appendDrawer"
            :key="`${_uid}-append-drawer-${index}`"
            cols="12"
          >
            <v-btn class="list-item" exact nuxt text :to="item.to">
              {{ item.title }}
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </v-navigation-drawer>
</template>

<script>
import computedMixin from './computed'

export default {
  name: 'AppNavigation',

  mixins: [computedMixin],

  data() {
    return {
      appDrawer: false,
      appendDrawer: [
        { title: 'Terms & Conditions', to: { name: 'terms-conditions' } },
        { title: 'Privacy Policy', to: { name: 'privacy-policy' } },
        { title: 'Help', to: { name: 'help' } }
      ]
    }
  },

  created() {
    this.$nuxt.$on('toggle-nav-drawer', () => {
      this.appDrawer = !this.appDrawer
    })
  },

  methods: {
    openLink(link) {
      window.open(link, '_self')
    }
  }
}
</script>

<style lang="scss" scoped>
.v-navigation-drawer--temporary {
  z-index: 1500;
}

.active-menu-item {
  background-color: #f39b44 !important;
}

.list-item {
  color: var(--v-black-base) !important;
  &::before {
    opacity: 0;
  }
}
</style>
