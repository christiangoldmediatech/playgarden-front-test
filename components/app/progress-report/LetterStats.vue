<template>
  <div class="">
    <v-list three-line>
      <template v-for="(item, index) in letterStats.reports">
        <item-progress
          :key="index"
          :item="item"
          :index="index"
          :total="letterStats.reports.length"
          :curriculum-type-id="letterStats.curriculumTypeId"
        />
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

  props: {
    letterStats: {
      type: Object,
      required: true,
      default: () => {}
    }
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
