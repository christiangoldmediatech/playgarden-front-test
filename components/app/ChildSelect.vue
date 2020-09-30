<template>
  <pg-select
    :value="value"
    :items="childrenList"
    placeholder="Select a child"
    solo
    v-bind="{ ...$attrs }"
    @input="$emit('input', $event)"
  >
    <template v-slot:selection="{ item }">
      <v-list-item class="pa-0 w-100">
        <v-list-item-avatar>
          <v-img :src="item.backpack.image" />
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title class="text-truncate">
            {{ item.firstName }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>

    <template v-slot:item="{ item, on, attrs }">
      <v-list-item v-bind="attrs" class="w-100" v-on="on">
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

    <template v-slot:append-item>
      <v-list-item v-if="!previewMode && !isUserCaregiver">
        <v-list-item-content>
          <v-btn
            color="primary"
            nuxt
            :to="{ name: 'app-account', query: { tab: 2 } }"
          >
            Manage Student Profiles
          </v-btn>
        </v-list-item-content>
      </v-list-item>
    </template>
  </pg-select>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'ChildSelect',

  props: {
    value: {
      required: true,
      validator: (val) => {
        return val === null || typeof val === 'number'
      }
    },

    previewMode: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  computed: {
    ...mapGetters('auth', ['isUserCaregiver']),

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
