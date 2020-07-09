<template>
  <v-row
    v-bind="$attrs"
    :class="{'horizontal': horizontal}"
    no-gutters
    v-on="$listeners"
  >
    <v-col
      v-for="(item, index) in items"
      :key="`${_uid}-${index}`"
      :cols="horizontal ? 'auto' : 12"
    >
      <v-btn
        class="list-item"
        exact
        nuxt
        text
        :to="item.to"
        @click="handleClick(item)"
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
    handleClick (item) {
      if (item.handleClick) {
        item.handleClick()
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
  &::before{
    opacity: 0;
  }
}
</style>
