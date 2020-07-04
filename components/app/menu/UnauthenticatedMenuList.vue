<template>
  <item-list
    :items="items"
    :horizontal="horizontal"
    v-bind="$attrs"
    v-on="$listeners"
  />
</template>

<script>
import ItemList from '@/components/app/menu/ItemList.vue'

export default {
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
          to: '/'
        },
        {
          title: 'What we offer',
          to: '/'
        },
        {
          title: 'Our Curriculum',
          to: '/'
        },
        {
          title: 'Get to know us',
          to: '/'
        },
        {
          title: 'Playgarden',
          to: '/'
        }
      ]
    }
  }
}
</script>

<style>

</style>
