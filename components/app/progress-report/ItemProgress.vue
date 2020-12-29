<template>
  <v-row>
    <v-col cols="2" class="ml-4">
      <v-progress-circular
        :rotate="360"
        :size="70"
        :width="5"
        :value="item.percentage"
        color="orange lighten-1"
      >
        <span class="stats">{{ `${item.done}/${item.total}` }}</span>
      </v-progress-circular>
    </v-col>
    <v-col class="ml-2">
      <p class="text-stats">
        <span class="font-weight-bold text-stats">
          {{ item.title }}
        </span>
      </p>
      <p class="text-stats">
        {{ item.description }}
      </p>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'ItemProgress',

  props: {
    item: {
      type: Object,
      required: true,
      default: () => {}
    }
  },

  data: () => ({}),

  computed: {},

  watch: {},

  created () {},

  methods: {}
}
</script>

<style lang="scss" scoped>
.stats {
  color: var(--v-black-base) !important;
}

.text-stats {
  color: var(--v-black-base) !important;
}
</style>
