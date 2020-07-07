<template>
  <v-app
    class="pg-app"
  >
    <v-navigation-drawer
      v-model="appDrawer"
      app
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
        <v-list-item-group v-model="selected">
          <v-list-item
            v-for="(item, i) in menuItems"
            :key="i"
            link
            @click="item.action()"
          >
            <v-list-item-icon>
              <v-icon>
                {{ item.icon }}
              </v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      color="primary"
      clipped-left
      dark
    >
      <v-app-bar-nav-icon @click.stop="appDrawer = !appDrawer" />

      <v-toolbar-title v-if="$vuetify.breakpoint.mdAndDown">
        PlayGardenPrep Admin
      </v-toolbar-title>

      <v-spacer />

      <!--
      <v-btn icon @click.stop="$router.push('/admin')">
        <v-icon>
          mdi-cog
        </v-icon>
      </v-btn>
      -->

      <v-btn icon @click.stop="logout()">
        <v-icon>
          mdi-logout
        </v-icon>
      </v-btn>
    </v-app-bar>

    <nuxt />

    <v-footer>
      &copy; 2020 <span v-if="new Date().getFullYear() > 2020"> - {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      appDrawer: false,
      selected: null,
      menuItems: [
        {
          icon: 'mdi-home',
          title: 'Home',
          action: () => this.$router.push('/admin')
        },
        {
          icon: 'mdi-order-alphabetical-ascending',
          title: 'Curriculum',
          action: () => this.$router.push('/admin')
        },
        {
          icon: 'mdi-calendar',
          title: 'Activities',
          action: () => this.$router.push('/admin')
        },
        {
          icon: 'mdi-human-greeting',
          title: 'Parents Corner',
          action: () => this.$router.push('/admin')
        },
        {
          icon: 'mdi-account-multiple',
          title: 'Users',
          action: () => this.$router.push('/admin')
        },
        {
          icon: 'mdi-cog',
          title: 'Settings',
          action: () => this.$router.push('/admin')
        },
        {
          icon: 'mdi-logout',
          title: 'Logout',
          action: () => this.logout()
        }
      ]
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
