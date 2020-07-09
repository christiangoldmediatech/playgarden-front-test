<template>
  <item-list
    v-bind="$attrs"
    :horizontal="horizontal"
    :items="items"
    v-on="$listeners"
  />
</template>

<script>
import ItemList from '@/components/app/menu/ItemList.vue'

export default {
  name: 'UnauthenticatedMenuList',

  components: {
    ItemList
  },

  props: {
    horizontal: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data: () => ({
    items: [
      { title: 'Home', to: { name: 'auth-login' } },
      { title: 'What we offer', to: { name: 'auth-login' } },
      { title: 'Our Curriculum', to: { name: 'auth-login' } },
      { title: 'Get to know us', to: { name: 'auth-login' } },
      { title: 'Playgarden', to: { name: 'auth-login' } }
    ]
  })
}
</script>
