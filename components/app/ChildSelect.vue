<template>
  <pg-select
    :value="internalValue"
    :items="childrenList"
    placeholder="Select a child"
    solo
    data-test-id="child-select"
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
          :disabled="item.disabled"
          :value="attrs.inputValue"
        />

        <v-list-item-avatar>
          <v-img :src="item.backpack.image" />
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title :class="{ 'pl-2': multiple }">
            {{ item.firstName }}
          </v-list-item-title>
          <v-list-item-subtitle
            v-if="item.disabled"
            :class="{ 'pl-2': multiple, 'grey--text': true }"
          >
            Already on a Playdate
          </v-list-item-subtitle>
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
      default: null
    },

    playdates: {
      type: Array,
      default: () => []
    },

    managementButton: {
      type: Boolean,
      default: false
    }
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
          disabled: this.childrenIdWithPlaydates.includes(child.id),
          ...child
        }
      })
    },

    childrenIdWithPlaydates () {
      return this.playdates
        // filter children that have playdates
        .filter(playdate => playdate && Array.isArray(playdate.playdates) && playdate.playdates.length > 0)
        // map those children id
        .map(playdate => playdate && playdate.children ? playdate.children.id : undefined)
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
