<template>
  <v-app-bar
    app
    class="pb-4 pg-app-bar"
    :class="{ 'pg-app-bar-height': (!isUserLoggedIn && $vuetify.breakpoint.mdAndUp), 'pg-app-bar-mobile-height': (!isUserLoggedIn && !$vuetify.breakpoint.mdAndUp )}"
    color="white"
    elevation="1"
    prominent
  >
    <v-row
      class="flex-nowrap pb-10"
      align="center"
      justify="space-between"
      no-gutters
    >
      <!-- HAMBURGER MENU -->
      <v-col class="d-flex align-center" cols="auto">
        <v-app-bar-nav-icon
          class="primary pg-app-bar-nav-icon hidden-md-and-up"
          :class="{ isMd: $vuetify.breakpoint.md }"
          color="white"
          tile
          large
          @click.stop="toggleDrawer"
        />

        <v-toolbar-title class="mx-3">
          <!-- <nuxt-link
            :to="{
              name: 'app-virtual-preschool',
            }"
          > -->
          <v-img
            class="mx-4 cursor-link"
            :class="{ 'mt-8': $vuetify.breakpoint.mdAndUp}"
            alt="Playarden Prep Online Logo"
            max-height="100"
            :max-width="$vuetify.breakpoint.mdAndUp ? 290 : 200"
            :src="require('@/assets/svg/logo.svg')"
            @click="handleLogoClick"
          />
          <!-- </nuxt-link> -->
        </v-toolbar-title>
      </v-col>

      <v-col class="pr-3 d-flex align-center" cols="auto">
        <!-- ITEMS -->
        <div v-if="getVerifyEmail" class="mt-5 hidden-sm-and-down">
          <v-toolbar-items>
            <template v-for="(item, index) in items">
              <!-- EXTERNAL LINK -->
              <v-btn
                v-if="item.external && !item.hidden"
                :key="`${_uid}-${index}`"
                class="px-2 text-none link-text px-lg-4"
                active-class="custom-active"
                text
                @click="openLink(item.link)"
              >
                {{ item.title }}
              </v-btn>

              <!-- INTERNAL LINK -->
              <v-btn
                v-else-if="!item.hidden"
                :key="`${_uid}-${index}`"
                class="px-2 text-none link-text px-lg-4"
                active-class="custom-active"
                text
                :ripple="true"
                :exact="item.exact"
                nuxt
                :data-test-id="item.to.name"
                :to="item.to"
                v-text="item.title"
              />
            </template>
          </v-toolbar-items>
        </div>
        <div v-if="!isUserLoggedIn" class="hidden-sm-and-down">
          <menu-landing-page class="mt-7" />
        </div>
        <!--divider icon profile and help-->
        <v-divider
          v-if="isUserLoggedIn && !isUserInSignupProcess && getVerifyEmail"
          class="mr-1 pg-app-bar-buttons hidden-sm-and-down auth-buttons"
          inset
          vertical
        />
        <!--divider icon profile and help-->

        <!-- AUTH BUTTONS -->
        <div class="pg-app-bar-buttons auth-buttons">
          <v-img
            v-if="isUserLoggedIn && !isUserInSignupProcess && getVerifyEmail"
            class="mx-2 clickable account-btn"
            :src="require('@/assets/svg/account-profile.svg')"
            @click="goToAccount"
          />
          <v-btn
            v-if="previewMode"
            class="ml-3 px-13"
            color="accent"
            nuxt
            :to="{ name: 'admin-curriculum-management' }"
          >
            Go Back
          </v-btn>

          <v-btn
            v-else-if="isUserLoggedIn && isUserInSignupProcess"
            class="ml-3 px-13"
            color="accent"
            nuxt
            :to="{ name: 'auth-logout' }"
          >
            LOG OUT
          </v-btn>
        </div>

        <!--Profile/help/Tutorial Menu-->
        <div v-if="isUserLoggedIn && !isUserInSignupProcess && getVerifyEmail">
          <v-menu open-on-hover offset-y>
            <template v-slot:activator="{ on }">
              <v-img
                class="mx-2 clickable account-btn pg-app-bar-buttons hidden-sm-and-down auth-buttons"
                :src="require('@/assets/png/Help.png')"
                v-on="on"
              />
            </template>

            <v-card>
              <v-list dense>
                <v-list-item>
                  <v-btn
                    class="btn-register text--disabled"
                    :ripple="false"
                    x-small
                    text
                    v-bind="
                      !previewMode
                        ? { nuxt: true, to: { name: 'app-onboarding' } }
                        : {}
                    "
                  >
                    <v-img
                      class="clickable account-btn"
                      :src="require('@/assets/png/Tutorial-icon.png')"
                    />
                    Tutorial
                  </v-btn>
                </v-list-item>

                <div class="px-2 py-3">
                  <v-divider />
                </div>
                <v-list-item>
                  <v-btn
                    class="btn-register text--disabled"
                    :ripple="false"
                    x-small
                    text
                    nuxt
                    :to="{ name: 'help' }"
                  >
                    <v-img
                      class="clickable account-btn"
                      :src="require('@/assets/png/FAQ.png')"
                    />
                    FAQ
                  </v-btn>
                </v-list-item>
              </v-list>
            </v-card>
          </v-menu>
        </div>
        <!-- Profile/help/Tutorial Menu end-->

        <!-- MOBILE ICONS -->
        <div
          v-if="getVerifyEmail"
          class="hidden-xs-only pg-app-bar-buttons mobile-icons"
        >
          <img
            v-if="isUserLoggedIn && !isUserInSignupProcess"
            class="clickable account-btn"
            src="@/assets/svg/account.svg"
            @click="goToAccount"
          >

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

          <!-- <v-btn
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
          </v-btn> -->
        </div>
      </v-col>
    </v-row>
  </v-app-bar>
</template>

<script>
import unauthenticatedRoutes from '@/utils/consts/unauthenticatedRoutes.json'
import MenuLandingPage from '@/components/app/header/MenuLandingPage.vue'
import computedMixin from './computed'

export default {
  name: 'ApplicationHeader',

  components: {
    MenuLandingPage
  },

  mixins: [computedMixin],

  props: {
    previewMode: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  methods: {
    toggleDrawer() {
      this.$nuxt.$emit('toggle-nav-drawer')
    },

    goToAccount() {
      this.$router.push({ name: 'app-account-index' })
    },

    handleLogoClick() {
      if (unauthenticatedRoutes[this.$route.name]) {
        window.open(process.env.frontendUrl, '_self')
        return
      }

      this.$router.push({ name: 'app-virtual-preschool' })
    },

    openLink(link) {
      window.open(link, '_self')
    }
  }
}
</script>

<style lang="scss" scoped>
.pg-app-bar.v-app-bar.v-app-bar--fixed {
  z-index: 1000 !important;
}

.pg-app-bar::v-deep .v-toolbar__content {
  padding-left: 0;
  padding-right: 0;
}

.pg-app-bar-nav-icon {
  height: 56px !important;
  width: 56px !important;
  &.isMd {
    height: 64px !important;
    width: 64px !important;
  }
}

.pg-app-bar-buttons {
  &.auth-buttons {
    display: block;
  }

  &.mobile-icons {
    display: none;
  }

  @media screen and (max-width: 1100px) {
    &.auth-buttons {
      display: none;
    }
    &.mobile-icons {
      display: block;
    }
  }
}

.cursor-link{
  cursor: pointer !important;
}

.account-btn {
  vertical-align: middle;
  width: 24px;
  height: 24px;
  margin-right: 4px;
  @media screen and (min-width: 1264px) {
    width: 36px;
    height: 36px;
    margin-right: 12px;
  }
}

// .pg-app-bar-col {
//   max-width: 1200px;

//   &.full-width {
//     max-width: 1600px;
//     padding-left: 24px;
//     padding-right: 24px;

//     &.mobile {
//       padding-left: 0px;
//       padding-right: 0px;
//     }
//   }
// }

.v-btn--active.custom-active {
  &::before {
    opacity: 0 !important;
  }
  &::after {
    width: 60%;
    position: absolute;
    bottom: 0;
    left: 20%;
    content: '';
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
  @media screen and (max-width: 1263px) {
    font-size: 12px !important;
  }
}

.pg-app-bar::v-deep.v-sheet.v-app-bar.v-toolbar:not(.v-sheet--outlined) {
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16) !important;
  height: 98px !important;
}

.pg-app-bar-height::v-deep.v-sheet.v-app-bar.v-toolbar:not(.v-sheet--outlined) {
  height: 146px !important;
}
.pg-app-bar-mobile-height::v-deep.v-sheet.v-app-bar.v-toolbar:not(.v-sheet--outlined) {
  height: 65px !important;
}
.btn-register:before {
  background-color: transparent !important;
}
</style>
