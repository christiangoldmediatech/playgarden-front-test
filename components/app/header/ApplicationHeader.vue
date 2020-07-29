<template>
  <v-app-bar
    color="white"
    elevation="3"
    app
  >
    <v-app-bar-nav-icon
      class="hidden-md-and-up primary app-bar-nav-icon"
      color="white"
      tile
      large
      @click.stop="toggleDrawer"
    />

    <v-spacer />

    <v-toolbar-title class="d-flex align-self-center">
      <img
        alt="Playarden Prep Online Logo"
        class="navbar-logo"
        src="@/assets/svg/logo.svg"
      >
    </v-toolbar-title>

    <v-spacer />

    <v-toolbar-items class="hidden-sm-and-down">
      <v-btn
        v-for="(item, index) in items"
        :key="`${_uid}-${index}`"
        class="text-none link-text"
        active-class="no-active"
        text
        :ripple="true"
        exact
        nuxt
        :to="item.to"
        v-text="item.title"
      />
    </v-toolbar-items>

    <v-btn
      class="white--text px-13 ml-3 hidden-sm-and-down"
      :color="(isUserLoggedIn) ? 'primary' : '#f89838'"
      :to="{ name: isUserLoggedIn ? 'app-account' : 'auth-login' }"
    >
      <template v-if="isUserLoggedIn">
        ACCOUNT
        <v-icon right>
          mdi-cog-outline
        </v-icon>
      </template>
      <template v-else>
        Login
      </template>
    </v-btn>

    <v-spacer class="hidden-sm-and-down" />

    <v-btn
      v-if="isUserLoggedIn"
      class="hidden-md-and-up"
      active-class="no-active"
      icon
      :to="{ name: 'app-account' }"
    >
      <v-icon color="#f89838">
        mdi-cog
      </v-icon>
    </v-btn>

    <v-btn
      class="hidden-md-and-up"
      :color="(isUserLoggedIn) ? 'primary' : '#f89838'"
      active-class="no-active"
      icon
      :to="{ name: isUserLoggedIn ? 'auth-logout' : 'auth-login' }"
    >
      <template v-if="isUserLoggedIn">
        <v-icon color="#f89838">
          mdi-logout
        </v-icon>
      </template>
      <template v-else>
        <v-icon color="primary">
          mdi-login
        </v-icon>
      </template>
    </v-btn>
  </v-app-bar>
</template>

<script>
import computedMixin from './computed'

export default {
  name: 'ApplicationHeader',

  mixins: [computedMixin],

  data () {
    return {

    }
  },

  methods: {
    toggleDrawer () {
      this.$nuxt.$emit('toggle-nav-drawer')
    }
  }
}
</script>

<style lang="scss" scoped>
.app-bar-nav-icon {
  margin-left: -16px !important;
  height: 56px !important;
  width: 56px !important;
}

.navbar-logo {
  max-height: 48px;
}

.v-btn--active.no-active::before {
  opacity: 0 !important;
}

.link-text {
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.44;
  letter-spacing: normal;
  text-align: left;
  color: #606060;
}

.no-border-radius {
  border-radius: 0px !important;
}
</style>
