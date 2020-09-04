<template>
  <v-select
    :value="value"
    :items="childrenList"
    placeholder="Select a child"
    solo
    v-bind="{ ...$attrs }"
    @input="$emit('input', $event)"
  >
    <template v-slot:selection="{ item }">
      <v-list-item>
        <v-list-item-avatar>
          <v-img :src="item.backpack.image" />
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>
            {{ item.firstName }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>

    <template v-slot:item="{ item, on, attrs }">
      <v-list-item
        v-bind="attrs"
        v-on="on"
      >
        <v-list-item-avatar>
          <v-img :src="item.backpack.image" />
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>
            {{ item.firstName }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>
  </v-select>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'ChildSelect',

  props: {
    value: {
      required: false,
      default: null,
      validator: (val) => {
        return (val === null || typeof val === 'number')
      }
    }
  },

  computed: {
    ...mapGetters('children', { children: 'rows' }),

    childrenList () {
      return this.children.map((child) => {
        return {
          value: child.id,
          text: child.firstName,
          ...child
        }
      })
    }
  },

  created () {
    this.getChildren()
  },

  methods: {
    ...mapActions('children', { getChildren: 'get' })
  }
}
</script>
