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

  data () {
    return {
      items: [
        {
          title: 'Home',
          to: { name: 'index' }
        },
        {
          title: 'What we offer',
          to: { name: 'index' }
        },
        {
          title: 'Our Curriculum',
          to: { name: 'index' }
        },
        {
          title: 'Get to know us',
          to: { name: 'index' }
        },
        {
          title: 'Playgarden',
          to: { name: 'index' }
        }
      ]
    }
  }
}
</script>
