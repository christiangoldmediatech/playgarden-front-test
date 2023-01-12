<template>
  <pg-select
    :value="value"
    :items="actualLetters"
    item-value="id"
    hide-details
    solo
    :placeholder="(labelTitle) ? labelTitle : 'Browse by letter'"
    v-bind="{ ...$attrs }"
    @input="$emit('input', $event)"
  >
    <template v-slot:selection="{ item }">
      <v-list-item v-if="item.asImage">
        <v-btn text>
          <span class="hidden-sm-and-down letter-title">
            Nature
          </span>
          <v-img
            width="70"
            height="70"
            contain
            class="ml-auto"
            :src="item.icon"
          />
        </v-btn>
      </v-list-item>
      <v-list-item v-else class="w-100">
        <v-list-item-content v-if="!slimVersion">
          <v-list-item-title class="letter-title">
            Letter {{ item.name.substr(0, 1) }}
          </v-list-item-title>
        </v-list-item-content>
        <recorded-letter
          v-bind="{ letter: item, small: smallLetter }"
          list-mode
        />
      </v-list-item>
    </template>

    <template v-slot:item="{ item, on, attrs }">
      <v-list-item v-if="item.asImage" v-bind="attrs" v-on="on">
        <v-btn class="d-flex w-100" text>
          <span class="hidden-sm-and-down letter-title">
            Nature
          </span>
          <img
            width="70px"
            height="70px"
            class="ml-auto pg-mr-[-15px]"
            :src="item.icon"
          />
        </v-btn>
      </v-list-item>
      <v-list-item v-else v-bind="attrs" class="w-100" v-on="on">
        <v-list-item-content v-if="!slimVersion">
          <v-list-item-title class="pl-4 letter-title" :class="{ 'letter-title-disabled': item.disabled }">
            Letter {{ item.name.substr(0, 1) }}
          </v-list-item-title>
        </v-list-item-content>

        <recorded-letter
          v-bind="{ letter: item, small: smallLetter, disabled: item.disabled }"
          list-mode
        />
      </v-list-item>
    </template>
  </pg-select>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import RecordedLetter from '@/components/app/live-sessions/recorded/RecordedLetter.vue'

export default {
  name: 'SmallLetterSelect',

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

<style lang="scss" scoped>
.letter-title {
  font-family: 'Poppins', sans-serif;
  font-style: normal;
  font-weight: 700;
  line-height: 30px;
  font-size: 14px;
  color: #606060;

  @media screen and (min-width: $breakpoint-sm) {
    font-size: 22px;
  }
}

.letter-title-disabled {
  color: rgba(0, 0, 0, 0.38);
}
</style>
