<template>
  <v-app-bar
    app
    class="pb-4 pg-app-bar paper-bg d-flex justify-center"
    :class="{
      'paper-bg-logged': isUserLoggedIn,
      'pg-app-bar-height': !isUserLoggedIn && $vuetify.breakpoint.mdAndUp,
      'pg-app-bar-mobile-height':
        !isUserLoggedIn && !$vuetify.breakpoint.mdAndUp,
      'd-none mt-n16': scrollDown
    }"
    color="transparent"
    flat
    prominent
  >
    <v-row
      class="flex-nowrap"
      :class="[isUserLoggedIn ? 'pb-10' : 'header-container']"
      align="center"
      justify="space-between"
      no-gutters
    >
      <!-- HAMBURGER MENU -->
      <v-app-bar-nav-icon
        class="pg-app-bar-nav-icon hidden-lg-and-up ham-menu"
        :class="{ 'is-md': $vuetify.breakpoint.md }"
        color="primary"
        tile
        x-large
        @click.stop="toggleDrawer"
      >
        <img width="27" height="27" loading="lazy" src="https://playgardenonline.com/wp-content/uploads/2022/02/bar-menu.svg">
      </v-app-bar-nav-icon>

      <!-- Logo -->
      <v-col class="d-flex align-center logo-container" cols="auto">
        <v-toolbar-title :class="[ isUserLoggedIn ? 'mx-3 mt-1' : '']">
          <v-img
            class="cursor-link"
            :class="[isUserLoggedIn ? 'mx-4' : '']"
            alt="Playarden Prep Online Logo"
            :max-width="$vuetify.breakpoint.mdAndUp ? 100 : 70"
            :src="require('@/assets/png/rainbow-logo.png')"
            @click="handleLogoClick"
          />
        </v-toolbar-title>
      </v-col>

      <v-col class="d-flex align-center pg-mr-2 md:pg-mr-0" cols="auto">
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
          <menu-landing-page />
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
                <!-- Hidden by ticket: https://app.shortcut.com/gold-media-tech/story/4106/hide-video-tutorial-option -->

                <!-- <v-list-item>
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
                </div> -->

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
            data-test-id="account-button"
            @click="goToAccount"
          >

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

  data() {
    return {
      scrollDown: false,
      currentScroll: 0
    }
  },

  created() {
    // eslint-disable-next-line nuxt/no-globals-in-created
    window.addEventListener('scroll', this.toggleHeader)
  },

  destroyed() {
    window.removeEventListener('scroll', this.toggleHeader)
  },

  methods: {
    toggleDrawer() {
      this.$nuxt.$emit('toggle-nav-drawer')
    },

    goToAccount() {
      this.$router.push({ name: 'app-account-index' })
    },

    handleLogoClick() {
      if (
        unauthenticatedRoutes[this.$route.name] ||
        this.isUserInSignupProcess
      ) {
        window.open(process.env.frontendUrl, '_self')
        return
      }

      this.$router.push({ name: 'app-virtual-preschool' })
    },

    openLink(link) {
      window.open(link, '_self')
    },

    toggleHeader(e) {
      if (this.$vuetify.breakpoint.mdAndDown) {
        const scroll = window.scrollY
        if (scroll > this.currentScroll) {
          this.scrollDown = true
          this.currentScroll = scroll
        } else if (scroll < this.currentScroll) {
          this.scrollDown = false
          this.currentScroll = scroll
        }
      } else {
        this.scrollDown = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.ham-menu {
  margin-right: 14px;
  margin-left: 38px;
  margin-bottom: 12px;
}

.logo-container {
  @media (max-width: $breakpoint-md) {
    margin-right: auto;
  }
}

.header-container {
  max-width: 1500px;
  padding: 31px 56px;

  @media (max-width: $breakpoint-md) {
    padding: 28px 32px 28px 0;
  }
}

.pg-app-bar.v-app-bar.v-app-bar--fixed {
  z-index: 1000 !important;
}

.pg-app-bar::v-deep .v-toolbar__content {
  padding: 0;
  width: 100%;
  justify-content: center;
}

.pg-app-bar-nav-icon {
  height: 56px !important;
  width: 56px !important;
  &.is-md {
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

  @media screen and (max-width: $breakpoint-sm) {
    &.auth-buttons {
      display: none;
    }
    &.mobile-icons {
      display: block;
    }
  }
}

.cursor-link {
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
  height: 170px !important;
}

@media screen and (max-width: 768px) {
  .pg-app-bar::v-deep.v-sheet.v-app-bar.v-toolbar:not(.v-sheet--outlined) {
    height: 150px !important;
  }
}

.pg-app-bar-height::v-deep.v-sheet.v-app-bar.v-toolbar:not(.v-sheet--outlined) {
  height: 200px !important;

  @media screen and (max-width: 1024px) {
    height: 186px !important;
  }
}
.btn-register:before {
  background-color: transparent !important;
}

.paper-bg {
  background-image: url('~@/assets/webp/paper-header.webp');
  background-size: cover;
  background-position: center bottom;

  @media screen and (max-width: 1201px) {
    background-image: url('~@/assets/webp/paper-header-mobile.webp');
    background-size: cover;
    background-position: center bottom;
  }
}

.paper-bg-logged {
  background-image: url('~@/assets/png/paper-header.png');

  @media screen and (max-width: 1201px) {
    background-image: url('~@/assets/png/paper-header-mobile.png');
  }
}
</style>
