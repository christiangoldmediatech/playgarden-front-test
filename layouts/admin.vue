<template>
  <v-app
    class="pg-app"
  >
    <v-navigation-drawer
      v-model="appDrawer"
      app
      :permanent="$vuetify.breakpoint.mdAndUp"
      width="296"
    >
      <!-- Logo -->
      <v-container fluid>
        <v-row class="px-6 py-2 py-md-7">
          <span class="font-weight-medium logo-text pl-4">Web Admin</span>
          <img
            alt="Playarden Prep Online Logo"
            class="logo"
            src="@/assets/svg/logo.svg"
          >
        </v-row>
      </v-container>

      <v-divider />

      <!-- Menu -->
      <v-list
        dense
        mandatory
      >
        <template v-for="(item, i) in menuItems">
          <!-- Menu with sub items color="accent" -->
          <v-list-group
            v-if="item.children"
            :key="`app-menu-item-${i}`"
            active-class="white--text active-menu-item font-weight-black"
            :group="item.rootPath"
            no-action
          >
            <template v-slot:prependIcon>
              <!-- Former color="primary darken-2" -->
              <v-icon
                v-text="item.icon"
              />
            </template>

            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title v-text="item.title" />
              </v-list-item-content>
            </template>

            <v-list-item
              v-for="(subItem, j) in item.children"
              :key="`app-menu-item-${i}-sub-item-${j}`"
              active-class="white--text active-menu-item font-weight-black"
              exact
              link
              nuxt
              :to="`${item.rootPath}/${subItem.route}`"
            >
              <v-list-item-content>
                <v-list-item-title v-text="subItem.title" />
              </v-list-item-content>
            </v-list-item>
          </v-list-group>

          <!-- Normal menu item -->
          <v-list-item
            v-else
            :key="`app-menu-item-${i}`"
            active-class="white--text active-menu-item font-weight-black"
            exact
            link
            nuxt
            :to="item.route"
          >
            <v-list-item-icon>
              <!-- Former color="primary darken-2" -->
              <v-icon>
                {{ item.icon }}
              </v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title v-text="item.title" />
            </v-list-item-content>
          </v-list-item>
        </template>

        <!-- Log out button -->
        <v-list-item
          active-class="white--text active-menu-item font-weight-black"
          link
          nuxt
          :to="{ name: 'auth-logout' }"
        >
          <v-list-item-icon>
            <!-- Former color="accent" -->
            <v-icon>
              mdi-logout
            </v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Log out</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      clipped-left
      color="primary"
      dark
      elevation="0"
    >
      <v-app-bar-nav-icon class="app-bar-style" @click.stop="appDrawer = !appDrawer" />

      <v-toolbar-title class="d-flex flex-column hidden-md-and-up">
        <!-- PlayGarden Prep Online - Web Admin -->
        <span class="font-weight-medium navbar-logo-text pl-4">Web Admin</span>
        <img
          alt="Playarden Prep Online Logo"
          class="navbar-logo"
          src="@/assets/svg/logo.svg"
        >
      </v-toolbar-title>

      <v-spacer />

      <span class="black--text mr-2 text--lighten-1">{{ userInfo.fullName }}</span>

      <v-btn class="hidden-md-and-up" icon nuxt :to="{ name: 'auth-logout' }">
        <v-icon>
          mdi-logout
        </v-icon>
      </v-btn>

      <v-btn
        class="hidden-sm-and-down"
        color="font-weight-medium white primary--text text--darken-2 text-none"
        depressed
        nuxt
        :to="{ name: 'auth-logout' }"
      >
        Log out
      </v-btn>
    </v-app-bar>

    <v-main class="pg-bkg">
      <admin-prompt-dialog />
      <nuxt />
    </v-main>
    <!--
    <v-footer app>
      &copy; 2020 <span v-if="new Date().getFullYear() > 2020"> - {{ new Date().getFullYear() }}</span>
    </v-footer>
    -->
    <notify-event />
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
import AdminPromptDialog from '@/components/admin/AdminPromptDialog.vue'

export default {
  name: 'Admin',

  middleware: ['checkJWT'],

  components: {
    AdminPromptDialog
  },

  data () {
    return {
      appDrawer: false,
      menuItemsData: [
        /*
        {
          icon: 'mdi-home',
          title: 'Home',
          route: '/admin'
        },
        */
        {
          icon: 'mdi-teach',
          title: 'Curriculum management',
          route: '/admin/curriculum-management'
        },
        {
          icon: 'mdi-television-play',
          title: 'Activities management',
          route: '/admin/activity-management'
        },
        {
          icon: 'mdi-account-supervisor',
          title: 'Parents corner blog',
          route: '/admin/parents-corner-blog'
        },
        {
          icon: 'mdi-account',
          title: 'User manager',
          route: '/admin/user-manager'
        },
        {
          icon: 'mdi-cog',
          title: 'Settings',
          rootPath: '/admin/settings',
          children: [
            {
              title: 'Curriculum Types',
              route: 'curriculum-types'
            },
            {
              title: 'Report Card Types',
              route: 'report-card-types'
            },
            {
              title: 'Role Management',
              route: 'role-management'
            },
            {
              title: 'Activity Types',
              route: 'activity-types'
            }
          ]
        }
      ]
    }
  },

  computed: {
    ...mapGetters('auth', {
      userInfo: 'getUserInfo'
    }),

    menuItems () {
      return this.menuItemsData.map((item) => {
        if (item.children) {
          item.children.sort((a, b) => {
            if (a.title < b.title) { return -1 }
            if (a.title > b.title) { return 1 }
            return 0
          })
        }

        return item
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.v-application ::v-deep {
  *,
  .display-1,
  .display-2,
  .display-3,
  .display-4,
  .headline,
  .title,
  .subtitle-1,
  .subtitle-2,
  .body-1,
  .body-2,
  .caption,
  .overline,
  .text-h1,
  .text-h2,
  .text-h3,
  .text-h4,
  .text-h5,
  .text-h6 {
    font-family: 'Poppins', sans-serif !important;
  }

  .v-data-footer {
    border: none;
  }

  .v-data-table tr > td, thead > tr > th {
    border-bottom: 1px dashed rgba(0, 0, 0, 0.12) !important;
  }

  .v-data-table tr > td:not(:last-child), thead > tr > th:not(:last-child) {
    border-right: 1px dashed rgba(0, 0, 0, 0.12) !important;
  }

  header.v-app-bar {
    background-image: linear-gradient(to bottom, #d3f5a8 -132%, #c2daa5 202%) !important;
    background-color: transparent !important;
  }

  .navbar-logo {
  max-height: 32px;
  }

  .logo {
  max-width: 100%;
  }

  .logo-text {
    color: #78c383 !important;
  }

  .navbar-logo-text {
    color: #78c383 !important;
    font-size: 12px;
  }

  .active-menu-item {
    background-color: #f39b44 !important;
  }

  .pg-app {
    height: 100%;
    margin: 0 auto;
    color: $pg-black;
  }

  .pg-bkg {
    background-color: #F9F9F9 !important;
  }
}
</style>
