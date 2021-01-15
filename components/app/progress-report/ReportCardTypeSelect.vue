<template>
  <pg-select
    v-model="optionSelected"
    :items="recordTypesList"
    item-text="name"
    item-value="name"
    placeholder="Select Menu"
    solo
    v-bind="{ ...$attrs }"
    @input="$emit('input', $event)"
  >
    <template v-slot:selection="{ item }">
      <v-list-item class="pa-0 w-100">
        <v-list-item-avatar>
          <v-img v-if="item.name === 'General'" :src="require('@/assets/svg/general.svg')" max-width="60" />
          <v-img v-else :src="item.icon" />
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title class="text-truncate">
            {{ item.name }}
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
          <v-img v-if="item.name === 'General'" :src="require('@/assets/svg/general.svg')" max-width="60" />
          <v-img v-else :src="item.icon" />
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title :class="{ 'pl-2': multiple }">
            {{ item.name }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>
  </pg-select>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'ReportCardTypeSelect',

  props: {},

  data () {
    return {
      optionSelected: {
        name: 'General',
        icon: 'assets/svg/general.svg'
      }
    }
  },

  computed: {
    ...mapGetters('auth', ['isUserCaregiver']),

    ...mapGetters('admin/report-card', ['types']),

    internalValue () {
      return this.value
    },

    multiple () {
      return (
        'multiple' in this.$attrs &&
        (this.$attrs.multiple === '' || this.$attrs.multiple)
      )
    },

    recordTypesList () {
      const menuGeneral = {
        name: 'General',
        icon: 'assets/svg/general.svg'
      }
      return [menuGeneral, ...this.types]
    }
  },

  created () {
    this.getTypes()
  },

  methods: {
    ...mapActions('admin/report-card', ['getTypes'])
  }
}
</script>
