<template>
  <pg-select
    :value="value"
    :items="actualLetters"
    item-value="id"
    hide-details
    solo
    :placeholder="(labelTitle) ? labelTitle : $t('commonWords.browseByLetter')"
    v-bind="{ ...$attrs }"
    @input="$emit('input', $event)"
  >
    <template v-slot:selection="{ item }">
      <v-list-item v-if="item.asImage">
        <v-btn text>
          <v-img
            width="70"
            height="70"
            contain
            class="ml-n4"
            :src="item.icon"
          />
          <span class="hidden-sm-and-down">
            {{ $t('dailyLessons.letterSelect.nature') }}
          </span>
        </v-btn>
      </v-list-item>
      <v-list-item v-else-if="item.name === 'Welcome'">
        <v-btn text>
          <v-img
            width="35"
            height="35"
            contain
            class="ml-n4 mr-4"
            :src="item.icon"
          />
          <span class="hidden-sm-and-down">
            {{ $t('dailyLessons.letterSelect.welcome') }}
          </span>
        </v-btn>
      </v-list-item>
      <v-list-item v-else class="w-100">
        <recorded-letter
          v-bind="{ letter: item, small: smallLetter }"
          list-mode
        />

        <v-list-item-content v-if="!slimVersion">
          <v-list-item-title class="font-weight-bold pl-4">
            {{ $t('commonWords.letter') }} {{ item.name.substr(0, 1) }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>

    <template v-slot:item="{ item, on, attrs }">
      <v-list-item v-if="item.asImage" v-bind="attrs" v-on="on">
        <v-btn text>
          <v-img
            width="70"
            height="70"
            contain
            class="ml-n4"
            :src="item.icon"
          />
          <span class="hidden-sm-and-down">
            {{ $t('dailyLessons.letterSelect.nature') }}
          </span>
        </v-btn>
      </v-list-item>
      <v-list-item v-else-if="item.name === 'Welcome'" v-bind="attrs" v-on="on">
        <v-btn text>
          <v-img
            width="35"
            height="35"
            contain
            class="ml-n1 mr-4"
            :src="item.icon"
          />
          <span class="hidden-sm-and-down">
            {{ $t('dailyLessons.letterSelect.welcome') }}
          </span>
        </v-btn>
      </v-list-item>
      <v-list-item v-else v-bind="attrs" class="w-100" v-on="on">
        <recorded-letter
          v-bind="{ letter: item, small: smallLetter, disabled: item.disabled }"
          list-mode
        />

        <v-list-item-content v-if="!slimVersion">
          <v-list-item-title class="pl-4">
            {{ $t('commonWords.letter') }} {{ item.name.substr(0, 1) }}
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
    },

    smallLetter: {
      type: Boolean,
      required: false,
      default: false
    },

    disabledLetters: {
      type: Array,
      required: false,
      default: () => []
    },

    slimVersion: {
      type: Boolean,
      required: false,
      default: false
    },

    labelTitle: {
      type: String,
      required: false,
      default: ''
    }
  },

  computed: {
    ...mapGetters('admin/curriculum', { letters: 'types' }),

    actualLetters () {
      const letters = this.letters.map((letter) => {
        return {
          ...letter,
          disabled: this.disabledLetters.includes(letter.id)
        }
      })

      letters.splice(4, 0, {
        asImage: true,
        icon: require('@/assets/svg/carousel-letters/nature.svg'),
        letter: 'Nature',
        id: 27,
        name: 'Nature',
        disabled: false
      })

      return letters
    }
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
