<template>
  <v-container
    fluid
    class="header-container"
    :class="{'mobile': $vuetify.breakpoint.smAndDown}"
  >
    <v-row
      no-gutters
      class="header-row"
      justify="center"
      align-content="center"
    >
      <v-col
        cols="auto"
        class="header-menu"
        :class="{'mobile': $vuetify.breakpoint.smAndDown}"
      >
        <div class="logo">
          <img
            src="@/assets/svg/logo.svg"
            alt="Playgarden Prep's Logo"
          >
        </div>
        <div
          v-if="!$vuetify.breakpoint.smAndDown"
          class="pt-1 menu"
        >
          <unauthenticated-menu-list horizontal />
        </div>
      </v-col>
    </v-row>
    <v-btn
      color="primary"
      class="header-action-btn"
      :icon="$vuetify.breakpoint.smAndDown"
      :ripple="!$vuetify.breakpoint.smAndDown"
      :class="{'mobile': $vuetify.breakpoint.smAndDown}"
    >
      <template v-if="$vuetify.breakpoint.smAndDown">
        Login <v-icon>mdi-login-variant</v-icon>
      </template>
      <template v-else>
        Login
      </template>
    </v-btn>
  </v-container>
</template>

<script>
import UnauthenticatedMenuList from '@/components/app/menu/UnauthenticatedMenuList.vue'

export default {
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
