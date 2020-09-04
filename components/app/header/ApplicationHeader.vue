<template>
  <v-app-bar color="white" elevation="3" app>
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
        active-class="custom-active"
        text
        :ripple="true"
        :exact="item.exact"
        nuxt
        :to="item.to"
        v-text="item.title"
      />
    </v-toolbar-items>

    <div class="position-header-btn">
      <v-btn
        v-if="!isUserLoggedIn"
        class="px-13 ml-3 hidden-sm-and-down text-right btn-register"
        color="accent"
        nuxt
        text
        :to="{ name: 'auth-signup' }"
      >
        REGISTER
      </v-btn>

      <v-btn
        class="px-13 ml-3 hidden-sm-and-down text-right"
        color="accent"
        nuxt
        :to="{ name: isUserLoggedIn ? 'app-account' : 'auth-login' }"
      >
        {{ isUserLoggedIn ? "ACCOUNT" : "LOGIN" }}
      </v-btn>
    </div>

    <v-spacer class="hidden-sm-and-down" />

    <v-btn
      v-if="isUserLoggedIn"
      class="hidden-md-and-up"
      active-class="custom-active"
      icon
      :to="{ name: 'app-account' }"
    >
      <v-icon color="accent">
        mdi-cog
      </v-icon>
    </v-btn>

    <v-btn
      class="hidden-md-and-up"
      :color="isUserLoggedIn ? 'primary' : 'accent'"
      active-class="custom-active"
      icon
      :to="{ name: isUserLoggedIn ? 'auth-logout' : 'auth-login' }"
    >
      <template v-if="isUserLoggedIn">
        <v-icon color="accent">
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

.v-btn--active.custom-active {
  &::before {
    opacity: 0 !important;
  }
  &::after {
    width: 60%;
    position: absolute;
    bottom: 33.33%;
    left: 20%;
    content: "";
    z-index: -1;
    border-bottom: 2px solid var(--v-primary-base);
    border-radius: 7px;
  }
}

.link-text {
  font-size: 14px;
  font-weight: 400 !important;
  font-style: normal;
  line-height: 1.44;
  letter-spacing: normal;
  text-align: left;
  color: #606060 !important;
}

.no-border-radius {
  border-radius: 0px !important;
}

.btn-register:before {
  background-color: transparent !important;
}

.position-header-btn {
  position: relative;
  right: -8%;
}
</style>
