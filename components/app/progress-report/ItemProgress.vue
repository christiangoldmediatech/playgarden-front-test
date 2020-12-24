<template>
  <v-row class="testCss">
    <v-col cols="2" class="ml-4">
      <v-progress-circular
        :rotate="360"
        :size="70"
        :width="15"
        :value="item.progress"
        color="orange lighten-1"
      >
        {{ item.progress }}
      </v-progress-circular>
    </v-col>
    <v-col class="ml-6">
      <p>
        <span>
          {{ item.name }}
        </span>
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Diam et, posuere risus.
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
.v-progress-circular__underlay {
  stroke: #ff6859 !important;
}
</style>
