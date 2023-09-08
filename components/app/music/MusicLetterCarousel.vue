<template>
  <div class="ma-0 pa-0 slide-group-wrapper">
    <v-row class="fill-height hidden-sm-and-down slide-group-wrapper" no-gutters>
      <!-- Desktop -->
      <v-col class="ma-0 pa-0 slide-group-wrapper px-6">
        <v-slide-group :value="value">
          <v-slide-item
            v-for="(letter, index) in displayLetters"
            :key="index"
          >
            <carousel-letter
              :word="letter.id === null"
              :disabled="letter.disabled"
              :name="letter.name"
              :picture="letter.picture"
              :selected="letter.id === value"
              @click="selectLetter(letter)"
            />
          </v-slide-item>
        </v-slide-group>
      </v-col>
    </v-row>

    <v-col cols="12" :class="mobileSelectClasses">
      <v-row>
        <pg-select
          :value="value"
          :items="displayLetters"
          item-value="id"
          hide-details
          solo
          placeholder="Browse by letter"
          @input="selectLetterById"
        >
          <template v-slot:selection="{ item }">
            <v-list-item>
              <carousel-letter
                :word="item.id === null"
                :disabled="item.disabled"
                :name="item.name"
                :picture="item.picture"
              />

              <v-list-item-content>
                <v-list-item-title v-if="item.id === null" class="pl-4">
                  All Letters
                </v-list-item-title>
                <v-list-item-title v-else-if="item.picture" class="pl-4">
                  Letter {{ item.name }}
                </v-list-item-title>
                <v-list-item-title v-else class="pl-4">
                  Letter {{ item.name.substr(0, 1) }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>

          <template v-slot:item="{ item, on, attrs }">
            <v-list-item v-bind="attrs" v-on="on">
              <carousel-letter
                :word="item.id === null"
                :disabled="item.disabled"
                :name="item.name"
                :picture="item.picture"
              />

              <v-list-item-content>
                <v-list-item-title v-if="item.id === null" class="pl-4">
                  {{ item.name }}
                </v-list-item-title>
                <v-list-item-title v-else-if="item.picture" class="pl-4">
                  Letter {{ item.name }}
                </v-list-item-title>
                <v-list-item-title v-else class="pl-4">
                  Letter {{ item.name.substr(0, 1) }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </pg-select>
      </v-row>
    </v-col>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import CarouselLetter from '@/components/app/music/CarouselLetter.vue'

export default {
  name: 'MusicLetterCarousel',

  components: {
    CarouselLetter
  },

  props: {
    value: {
      validator: (val) => {
        return typeof val === 'number' || val === null
      },
      required: true
    },

    loading: {
      type: Boolean,
      required: false,
      default: false
    },

    disabledLetters: {
      type: Array,
      required: false,
      default: () => []
    },

    isFullWidth: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    ...mapGetters('admin/curriculum', { letters: 'types' }),

    displayLetters () {
      if (Array.isArray(this.letters)) {
        const letters = [
          {
            id: null,
            disabled: false,
            name: 'All'
          },
          ...this.letters
        ]
        return letters.map((letter) => {
          return {
            ...letter,
            disabled: this.disabledLetters.includes(letter.id)
          }
        }).filter((letter) => {
          // remove intro and nature from music library ch2621
          return !['Intro', 'Nature'].includes(letter.name)
        })
      } else {
        return []
      }
    },

    mobileSelectClasses () {
      return {
        'letter-selector': !this.isFullWidth,
        'hidden-md-and-up mx-auto': true
      }
    }
  },

  async created () {
    await this.getLetters()
  },

  methods: {
    ...mapActions('admin/curriculum', {
      getLetters: 'getTypes'
    }),

    selectLetterById (letterId) {
      this.$emit('select', letterId)
    },

    selectLetter (letter) {
      if (letter.disabled) {
        return
      }
      this.$emit('select', letter.id)
    }
  }
}
</script>

<style lang="scss" scoped>
.letter-selector {
  max-width: 350px;
}
.slide-group-wrapper {
  width: 100%;
}
</style>
