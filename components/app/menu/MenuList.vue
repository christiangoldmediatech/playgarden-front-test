<template>
  <item-list
    v-bind="$attrs"
    :horizontal="horizontal"
    :items="items"
    v-on="$listeners"
  />
</template>

<script>
import { mapGetters } from 'vuex'

import ItemList from '@/components/app/menu/ItemList'

export default {
  name: 'MenuList',

  components: {
    ItemList
  },

  props: {
    inAppendDrawer: {
      type: Boolean,
      default: false
    },
    horizontal: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    ...mapGetters('auth', ['isUserLoggedIn']),

    items () {
      if (this.inAppendDrawer) {
        return [
          { title: 'Help', to: { name: 'app-dashboard' } },
          { title: 'Privacy Policy', to: { name: 'app-dashboard' } },
          { title: 'Terms & Conditions', to: { name: 'app-dashboard' } }
        ]
      }

      if (this.isUserLoggedIn) {
        return [
          { title: 'Dashboard', to: { name: 'app-dashboard' } },
          { title: 'Library', to: { name: 'auth-login' } },
          { title: 'Activities', to: { name: 'auth-login' } },
          { title: 'Profile', to: { name: 'auth-login' } },
          { title: 'Playgarden Prep', to: { name: 'auth-login' } }
        ]
      }

      return [
        { title: 'Home', to: { name: 'auth-login' } },
        { title: 'What we offer', to: { name: 'auth-login' } },
        { title: 'Our Curriculum', to: { name: 'auth-login' } },
        { title: 'Get to know us', to: { name: 'auth-login' } },
        { title: 'Playgarden', to: { name: 'auth-login' } }
      ]
    }
  }
}
</script>
