<template>
  <v-row>
    <v-col cols="2" class="ml-4">
      <v-progress-circular
        :rotate="360"
        :size="100"
        :width="15"
        :value="item.progress"
        color="accent"
      >
        {{ item.progress }}
      </v-progress-circular>
    </v-col>
    <v-col class="ml-12">
      <p class="ml-3">
        <span>
          {{ item.name }}
        </span>
      </p>
      <p class="ml-3">
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
