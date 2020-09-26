<template>
  <v-list class="py-0" dense>
    <v-list-item
      v-for="item in items"
      :key="`list-${_uid}-item-${item.id}`"
      class="dashboard-item"
      active-class="dashboard-item-active"
      exact-active-class="dashboard-item-exact"
      :disabled="item.disabled"
      nuxt
      link
      exact
      :to="item.to"
    >
      <v-list-item-avatar tile>
        <v-img
          :class="{ 'dashboard-panel-disabled': item.disabled }"
          :src="item.activityType.icon"
          contain
        />
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title>
          <span :class="['dashboard-item-activity-type', { 'dashboard-item-disabled': item.disabled }]">
            {{ item.activityType.name }}
          </span>
          <span
            v-if="item.name"
            :class="['dashboard-item-name', { 'dashboard-item-disabled': item.disabled }]"
          >
            with {{ item.name }}
          </span>
        </v-list-item-title>
        <v-list-item-subtitle :class="{ 'dashboard-item-disabled': item.disabled }">
          <span :class="{ 'dashboard-item-disabled': item.disabled }">{{ item.description }}</span>
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
export default {
  name: 'ContentList',

  props: {
    items: {
      type: Array,
      required: true
    }
  }
}
</script>

<style lang="scss">
.dashboard {
  &-item {
    &.v-list-item--link:before {
      content: none;
    }
    &-disabled {
      color: rgba(0, 0, 0, 0.38) !important;
    }
    &-activity-type {
      font-size: 16px !important;
      font-weight: bold !important;
      letter-spacing: 0.1em !important;
      text-transform: uppercase !important;
    }
    &-name {
      font-size: 12px !important;
    }
    &-exact, &-active {
      box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
                  0px 2px 2px 0px rgba(0, 0, 0, 0.14),
                  0px 1px 5px 0px rgba(0, 0, 0, 0.12);
    }
  }
}
</style>
