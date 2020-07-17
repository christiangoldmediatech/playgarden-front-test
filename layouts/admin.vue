<template>
  <v-app
    class="pg-app"
  >
    <v-navigation-drawer
      v-model="appDrawer"
      app
      :permanent="$vuetify.breakpoint.mdAndUp"
    >
      <v-container>
        <v-row>
          <v-img
            alt="Playgarden Prep's Logo"
            class="px-2"
            contain
            :src="require('@/assets/svg/logo.svg')"
          />
        </v-row>
      </v-container>

      <v-divider />

      <v-list
        dense
        mandatory
        nav
      >
        <template v-for="(item, i) in menuItems">
          <v-list-group
            v-if="item.children"
            :key="`app-menu-item-${i}`"
            color="primary darken-2"
            :group="item.rootPath"
            no-action
          >
            <template v-slot:prependIcon>
              <v-icon
                color="primary darken-2"
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

          <v-list-item
            v-else
            :key="`app-menu-item-${i}`"
            exact
            link
            nuxt
            :to="item.route"
          >
            <v-list-item-icon>
              <v-icon
                color="primary darken-2"
              >
                {{ item.icon }}
              </v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title v-text="item.title" />
            </v-list-item-content>
          </v-list-item>
        </template>

        <v-list-item
          link
          :to="{ name: 'auth-logout' }"
        >
          <v-list-item-icon>
            <v-icon
              color="primary darken-2"
            >
              mdi-logout
            </v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      clipped-left
      color="primary"
      dark
    >
      <v-app-bar-nav-icon @click.stop="appDrawer = !appDrawer" />

      <v-toolbar-title class="hidden-md-and-up">
        PlayGarden Prep Online Admin
      </v-toolbar-title>

      <v-spacer />

      <v-btn icon @click.stop="logout">
        <v-icon>
          mdi-logout
        </v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <admin-prompt-dialog />
      <nuxt />
    </v-main>

    <v-footer app>
      &copy; 2020 <span v-if="new Date().getFullYear() > 2020"> - {{ new Date().getFullYear() }}</span>
    </v-footer>

    <notify-event />
  </v-app>
</template>

<script>
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
        {
          icon: 'mdi-home',
          title: 'Home',
          route: '/admin'
        },
        {
          icon: 'mdi-order-alphabetical-ascending',
          title: 'Curriculum',
          route: '/admin/curriculum'
        },
        {
          icon: 'mdi-calendar',
          title: 'Activities',
          route: '/admin/activities'
        },
        {
          icon: 'mdi-human-greeting',
          title: 'Parents Corner',
          route: '/admin/parents-corner'
        },
        {
          icon: 'mdi-account-multiple',
          title: 'Users',
          route: '/admin/users'
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
.pg-app {
  height: 100%;
  margin: 0 auto;
  color: $pg-black;
}
</style>
