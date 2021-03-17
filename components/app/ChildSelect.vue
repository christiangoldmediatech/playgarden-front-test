<template>
  <pg-select
    :value="internalValue"
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
        <v-simple-checkbox
          v-if="multiple"
          color="primary"
          :ripple="false"
          :value="attrs.inputValue"
        />

        <v-list-item-avatar>
          <v-img :src="item.backpack.image" />
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title :class="{ 'pl-2': multiple }">
            {{ item.firstName }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>

    <template v-if="managementButton && !isUserCaregiver" v-slot:append-item>
      <v-list-item>
        <v-list-item-content>
          <v-btn
            color="primary"
            nuxt
            :to="{ name: 'app-account-index', query: { tab: 2 } }"
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
      type: [Array, Number, Object, String],
      required: true
    },

    managementButton: Boolean
  },

  computed: {
    ...mapGetters('auth', ['isUserCaregiver']),

    ...mapGetters('children', { children: 'rows' }),

    internalValue () {
      return this.multiple && !Array.isArray(this.value)
        ? [this.value]
        : this.value
    },

    multiple () {
      return (
        'multiple' in this.$attrs &&
        (this.$attrs.multiple === '' || this.$attrs.multiple)
      )
    },

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
