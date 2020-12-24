<template>
  <v-list three-line>
    <template v-for="(item, index) in types">
      <v-list-item
        :key="index"
        class="mt-6 mb-6"
      >
        <v-list-item-avatar>
          icon gauge
        </v-list-item-avatar>

        <v-list-item-content class="font-weight-bold ">
          <span>
            {{ item.name }}
          </span>
        </v-list-item-content>
      </v-list-item>
    </template>
  </v-list>
</template>

<script>

export default {
  name: 'LetterStats',

  data: () => ({
    types: [
      {
        name: 'test'
      }
    ]
  }),

  computed: {},

  watch: {},

  created () {},

  methods: {}
}
</script>
