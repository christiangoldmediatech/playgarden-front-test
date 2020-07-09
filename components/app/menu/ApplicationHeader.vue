<template>
  <v-container
    class="header-container"
    :class="{'mobile': $vuetify.breakpoint.smAndDown}"
    fluid
  >
    <v-row
      align-content="center"
      class="header-row"
      justify="center"
      no-gutters
    >
      <v-col
        class="header-menu"
        :class="{'mobile': $vuetify.breakpoint.smAndDown}"
        cols="auto"
      >
        <nuxt-link
          :to="{name: 'index'}"
        >
          <div class="logo">
            <img
              alt="Playgarden Prep's Logo"
              src="@/assets/svg/logo.svg"
            >
          </div>
        </nuxt-link>

        <div
          v-if="!$vuetify.breakpoint.smAndDown"
          class="menu pt-1"
        >
          <unauthenticated-menu-list horizontal />
        </div>
      </v-col>
    </v-row>

    <v-btn
      class="header-action-btn"
      :class="{mobile: $vuetify.breakpoint.smAndDown}"
      color="primary"
      :icon="$vuetify.breakpoint.smAndDown"
      nuxt
      :ripple="!$vuetify.breakpoint.smAndDown"
      :to="{name: 'auth-login'}"
    >
      <v-icon class="hidden-md-and-up">
        mdi-login-variant
      </v-icon>

      <span class="hidden-sm-and-down">Login</span>
    </v-btn>
  </v-container>
</template>

<script>
import UnauthenticatedMenuList from '@/components/app/menu/UnauthenticatedMenuList'

export default {
  name: 'ApplicationHeader',

  components: {
    UnauthenticatedMenuList
  }
}
</script>

<style lang="scss" scoped>
.header {
  &-container {
    position: relative;
    height: 200px;
    width: 100%;
    &.mobile {
      height: 80px;
    }
  }
  &-row {
    height: 100%;
    width: 100%;
  }
  &-menu {
    .logo {
      height: 75px;
      text-align: center;
      img {
        height: 100%;
      }
    }
    &.mobile {
      .logo {
        height: 45px;
      }
    }
  }
  &-action-btn {
    position: absolute;
    right: 30px;
    top: 20px;
    width: 150px;
    &.mobile {
      width: auto;
      right: 10px;
    }
  }
}
</style>
