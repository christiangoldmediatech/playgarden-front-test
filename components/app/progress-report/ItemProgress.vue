<template>
  <div class="">
    <v-row>
      <v-col cols="2" class="ml-4">
        <v-progress-circular
          :rotate="360"
          :size="($vuetify.breakpoint.mobile) ? 50 : 70"
          :width="5"
          :value="item.percentage"
          color="orange lighten-1"
        >
          <span class="stats">{{ `${item.done}/${item.total}` }}</span>
        </v-progress-circular>
      </v-col>
      <v-col class="ml-2 mt-6">
        <p class="text-stats">
          <span class="font-weight-bold text-stats">
            {{ item.title }}
          </span>
        </p>
        <!-- <p class="text-stats">
          {{ item.description }}
        </p> -->
      </v-col>
    </v-row>
    <v-divider v-if="!getShowDivider" class="ml-8 mr-8" />
  </div>
</template>

<script>
export default {
  name: 'ItemProgress',

  props: {
    item: {
      type: Object,
      required: true,
      default: () => {}
    },
    total: {
      type: Number,
      required: true,
      default: 0
    },
    index: {
      type: Number,
      required: true,
      default: 0
    }
  },

  data: () => ({}),

  computed: {
    getShowDivider () {
      return (this.index === (this.total - 1))
    }
  },

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
