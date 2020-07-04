<template>
  <v-row
    no-gutters
    v-bind="$attrs"
    :class="{'horizontal': horizontal}"
    v-on="$listeners"
  >
    <v-col
      v-for="(item, index) in items"
      :key="`${_uid}-${index}`"
      :cols="horizontal ? 'auto' : 12"
    >
      <v-btn
        nuxt
        text
        exact
        :to="item.to"
        class="list-item"
        @click="handleClick(item)"
      >
        {{ item.title }}
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
export default {
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
