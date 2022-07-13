<template>
  <v-list-group
    v-if="item.children"
    active-class="accent selected-menu-item"
    :group="itemRootPath"
    :prepend-icon="item.icon"
    no-action
    :sub-group="isChild"
  >
    <template v-slot:activator>
      <v-list-item-title>
        {{ item.title }}
      </v-list-item-title>
    </template>

    <menu-item
      v-for="(child, indexC) in item.children"
      :key="indexC"
      :item="child"
      :root-path="itemRootPath"
    />
  </v-list-group>

  <!-- Normal menu item -->
  <v-list-item
    v-else
    active-class="accent selected-menu-item"
    exact
    nuxt
    :to="itemRoute"
  >
    <v-list-item-icon v-if="item.icon">
      <v-icon>
        {{ item.icon }}
      </v-icon>
    </v-list-item-icon>

    <v-list-item-title>
      {{ item.title }}
    </v-list-item-title>
  </v-list-item>
</template>

<script>
import MenuItem from '@/components/admin/MenuItem'
export default {
  name: 'MenuItem',
  components: { MenuItem },
  props: {
    item: {
      type: Object,
      required: true
    },
    rootPath: {
      type: String,
      default: null
    }
  },
  computed: {
    isChild () {
      return Boolean(this.rootPath)
    },
    itemRootPath () {
      if (this.rootPath && this.item.rootPath) {
        return this.rootPath + this.item.rootPath
      } else if (this.item.rootPath) {
        return this.item.rootPath
      }
      return this.rootPath
    },
    itemRoute () {
      if (this.item.children) {
        return null
      }
      return this.itemRootPath
        ? `${this.itemRootPath}/${this.item.route}`
        : this.item.route
    }
  }
}
</script>

<style lang="scss" scoped>
.selected-menu-item ::v-deep .v-list-item__title {
  color: var(--v-white-base);
}
.selected-menu-item ::v-deep .v-list-item__icon {
  color: var(--v-white-base);
}
</style>
