<template>
  <v-app-bar app class="pg-app-bar" color="white" elevation="1">
    <v-row align="center" justify="center" no-gutters>
      <v-col class="pg-app-bar-col">
        <v-row align="center" justify="space-between" no-gutters>
          <v-app-bar-nav-icon
            class="hidden-md-and-up primary pg-app-bar-nav-icon"
            color="white"
            tile
            large
            @click.stop="toggleDrawer"
          />

          <v-toolbar-title class="d-flex align-self-center">
            <v-img
              alt="Playarden Prep Online Logo"
              contain
              max-width="200"
              :src="require('@/assets/svg/logo.svg')"
            />
          </v-toolbar-title>

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

          <div class="hidden-sm-and-down">
            <v-btn
              v-if="!isUserLoggedIn"
              class="px-13 ml-3 btn-register"
              color="accent"
              nuxt
              text
              :to="{ name: 'auth-signup' }"
            >
              REGISTER
            </v-btn>

            <v-btn
              v-if="isUserLoggedIn && !isUserInSingupProcess"
              class="px-13 ml-3"
              color="accent"
              nuxt
              :to="{ name: 'app-account' }"
            >
              ACCOUNT
            </v-btn>

            <v-btn
              v-if="isUserLoggedIn && isUserInSingupProcess"
              class="px-13 ml-3"
              color="accent"
              nuxt
              :to="{ name: 'auth-logout' }"
            >
              LOG OUT
            </v-btn>

            <v-btn
              v-else-if="!isUserLoggedIn"
              class="px-13 ml-3"
              color="accent"
              nuxt
              :to="{ name: 'auth-login' }"
            >
              LOGIN
            </v-btn>
          </div>

          <div class="hidden-xs-only hidden-md-and-up">
            <v-btn
              v-if="isUserLoggedIn && !isUserInSingupProcess"
              active-class="transparent--text"
              icon
              nuxt
              small
              :to="{ name: 'app-account' }"
            >
              <v-icon color="accent">
                mdi-cog
              </v-icon>
            </v-btn>

            <v-btn
              :color="isUserLoggedIn ? 'primary' : 'accent'"
              active-class="transparent--text"
              icon
              nuxt
              small
              :to="{ name: isUserLoggedIn ? 'auth-logout' : 'auth-login' }"
            >
              <v-icon v-if="isUserLoggedIn" color="accent">
                mdi-logout
              </v-icon>

              <v-icon v-else color="primary">
                mdi-login
              </v-icon>
            </v-btn>
          </div>

          <div class="hidden-sm-and-up">
            <!-- DON'T remove it, using for gird purposes -->
          </div>
        </v-row>
      </v-col>
    </v-row>
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
.pg-app-bar::v-deep .v-toolbar__content {
  padding-left: 0;
  padding-right: 0;
}

.pg-app-bar-nav-icon {
  height: 56px !important;
  width: 56px !important;
}

.pg-app-bar-col {
  max-width: 1200px;
}

.v-btn--active.custom-active {
  &::before {
    opacity: 0 !important;
  }
  &::after {
    width: 60%;
    position: absolute;
    bottom: 0;
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

.pg-app-bar::v-deep.v-sheet.v-app-bar.v-toolbar:not(.v-sheet--outlined) {
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16) !important;

}
.btn-register:before {
  background-color: transparent !important;
}
</style>
