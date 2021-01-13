<template>
  <pg-select
    :value="value"
    :items="letters"
    item-value="id"
    hide-details
    solo
    placeholder="Browse by letter"
    v-bind="{ ...$attrs }"
    @input="$emit('input', $event)"
  >
    <template v-slot:selection="{ item }">
      <v-list-item class="w-100">
        <recorded-letter
          v-bind="{ letter: item }"
          list-mode
        />

        <v-list-item-content>
          <v-list-item-title class="font-weight-bold pl-4">
            Letter {{ item.name.substr(0, 1) }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>

    <template v-slot:item="{ item, on, attrs }">
      <v-list-item v-bind="attrs" class="w-100" v-on="on">
        <recorded-letter
          v-bind="{ letter: item }"
          list-mode
        />

        <v-list-item-content>
          <v-list-item-title class="pl-4">
            Letter {{ item.name.substr(0, 1) }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>
  </pg-select>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import RecordedLetter from '@/components/app/live-sessions/recorded/RecordedLetter.vue'

export default {
  name: 'LetterSelect',

  components: {
    RecordedLetter
  },

  props: {
    value: {
      validator: (val) => {
        return val === null || typeof val === 'number'
      },
      required: true
    }
  },

  computed: {
    ...mapGetters('admin/curriculum', { letters: 'types' })
  },

  created () {
    this.getLetters()
  },

  methods: {
    ...mapActions('admin/curriculum', {
      getLetters: 'getTypes'
    })
  }
}
</script>
