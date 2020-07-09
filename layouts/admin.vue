<template>
  <v-app
    class="pg-app"
  >
    <v-navigation-drawer
      v-model="appDrawer"
      app
      :permanent="$vuetify.breakpoint.mdAndUp"
    >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">
            PlayGardenPrep Admin
          </v-list-item-title>
          <v-list-item-subtitle>
            Manage all things from here
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider />

      <v-list
        dense
        nav
      >
        <v-list-item-group
          v-model="selected"
          color="primary darken-2"
          mandatory
        >
          <v-list-item
            v-for="(item, i) in menuItems"
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
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            link
            @click="logout"
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
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      clipped-left
      color="primary"
      dark
    >
      <v-app-bar-nav-icon @click.stop="appDrawer = !appDrawer" />

      <v-toolbar-title v-if="$vuetify.breakpoint.smAndDown">
        PlayGardenPrep Admin
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
      selected: null,
      menuItems: [
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
          route: '/admin/settings'
        }
      ]
    }
  },

  methods: {
    logout () {
      this.$store.dispatch('auth/logout')
      this.$router.push('/')
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
