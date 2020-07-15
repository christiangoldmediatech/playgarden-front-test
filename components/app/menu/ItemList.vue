<template>
  <v-row v-bind="$attrs" :class="{ horizontal }" no-gutters v-on="$listeners">
    <v-col
      v-for="(item, index) in items"
      :key="`${_uid}-${index}`"
      :cols="horizontal ? 'auto' : 12"
    >
      <v-btn
        class="list-item"
        exact
        nuxt
        :ripple="horizontal"
        text
        :to="item.to"
        @click="onClick(item)"
      >
        {{ item.title }}
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'ItemList',

  props: {
    items: {
      type: Array,
      required: true
    },
    horizontal: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  methods: {
    onClick (item) {
      if (item.onClick) {
        item.onClick()
      } else {
        this.$emit('item-clicked', item)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.horizontal {
  border-top: 1px solid $pg-main;
  border-bottom: 1px solid $pg-main;
}
.list-item {
  color: $pg-black !important;
  &::before {
    opacity: 0;
  }
}
</style>
