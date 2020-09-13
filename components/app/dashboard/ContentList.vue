<template>
  <v-list class="py-0" dense>
    <v-list-item
      v-for="item in items"
      :key="`list-${_uid}-item-${item.id}`"
      :disabled="item.disabled"
      nuxt
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
        <v-list-item-title class="font-weight-bold">
          {{ item.name }}
        </v-list-item-title>
        <v-list-item-subtitle>
          {{ item.description }}
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
