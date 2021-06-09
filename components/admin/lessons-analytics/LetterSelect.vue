<template>
  <v-menu
    bottom
    origin="center center"
    transition="scale-transition"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        color="accent"
        icon
        v-bind="attrs"
        v-on="on"
      >
        <v-icon x-large>
          mdi-menu-down
        </v-icon>
      </v-btn>
    </template>

    <div class="selected-letter">
      <v-list>
        <v-list-item
          v-for="(item, i) in actualLetters"
          :key="i"
        >
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
                Nature
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
                Letter {{ item.name.substr(0, 1) }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item>
      </v-list>
    </div>
  </v-menu>
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
    smallLetter: {
      type: Boolean,
      required: false,
      default: false
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
          disabled: false
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

<style scoped>
.selected-letter {
    max-height: 250px !important;
    overflow: auto;
}
</style>
