<template>
  <div class="">
    <v-list three-line>
      <template v-for="(item, index) in types">
        <item-progress :key="index" :item="item" />
      </template>
    </v-list>
  </div>
</template>

<script>
import ItemProgress from './ItemProgress.vue'
export default {
  name: 'LetterStats',

  components: {
    ItemProgress
  },

  data: () => ({
    types: [
      {
        name: 'Daily Lessons Attended',
        progress: 69
      }
    ]
  }),

  computed: {},

  watch: {},

  created () {},

  methods: {}
}
</script>
