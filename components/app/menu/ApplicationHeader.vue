<template>
  <v-container
    fluid
    class="header-container"
  >
    <v-row
      no-gutters
      class="header-row"
      justify="center"
      align-content="center"
    >
      <v-col cols="auto" class="header-menu">
        <div class="logo">
          <img
            src="@/assets/logo.svg"
            alt="Playgarden Prep's Logo"
          >
        </div>
        <div class="pt-1">
          <unauthenticated-menu-list horizontal />
        </div>
      </v-col>
    </v-row>
    <v-btn
      class="header-action-btn"
      color="primary"
    >
      Login
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
  }
  &-action-btn {
    position: absolute;
    right: 30px;
    top: 20px;
    width: 150px;
  }
}
</style>
