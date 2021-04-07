<template>
  <div class="ma-0 pa-0">
    <v-row class="fill-height hidden-sm-and-down" no-gutters>
      <!-- Desktop -->
      <v-col class="ma-0 pa-0">
        <v-slide-group
          multiple
          show-arrows
          prev-icon="mdi-chevron-left accent--text"
          next-icon="mdi-chevron-right accent--text"
        >
          <v-slide-item
            v-for="(letter, index) in displayLetters"
            :key="index"
            :item="letter"
            :index="index"
          >
            <carousel-letter :name="letter.name" :picture="letter.picture" :selected="letter.id === 1" />
          </v-slide-item>
        </v-slide-group>
      </v-col>
    </v-row>

    <!-- <v-col cols="12" class="hidden-md-and-up">
      <v-row>
        <pg-select
          :value="value"
          :items="actualLetters"
          item-value="id"
          hide-details
          solo
          placeholder="Browse by letter"
          v-bind="{ ...$attrs }"
          @input="$nuxt.$emit('show-curriculum-progress', $event)"
        >
          <template v-slot:selection="{ item }">
            <v-list-item>
              <recorded-letter
                v-bind="{ letter: item, small: smallLetter }"
                list-mode
              />

              <v-list-item-content>
                <v-list-item-title v-if="item.picture" class="font-weight-bold pl-4">
                  Letter {{ item.name }}
                </v-list-item-title>
                <v-list-item-title v-else class="font-weight-bold pl-4">
                  Letter {{ item.name.substr(0, 1) }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>

          <template v-slot:item="{ item, on, attrs }">
            <v-list-item v-if="item.picture" v-bind="attrs" v-on="on">
              <v-btn text>
                <v-img
                  width="70"
                  height="70"
                  contain
                  class="ml-n4"
                  :src="item.picture"
                />
                <span class="pl-3">{{ item.name }}</span>
              </v-btn>
            </v-list-item>

            <v-list-item v-else v-bind="attrs" class="w-100" v-on="on">
              <recorded-letter
                v-bind="{
                  letter: item,
                  small: smallLetter,
                  disabled: item.disabled
                }"
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
      </v-row>
    </v-col> -->
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import CarouselLetter from '@/components/app/music/CarouselLetter.vue'
// import RecordedLetter from '@/components/app/live-sessions/recorded/RecordedLetter.vue'

export default {
  name: 'MusicLetterCarousel',

  components: {
    CarouselLetter
    // RecordedLetter
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
    }
  },

  computed: {
    ...mapGetters('admin/curriculum', { letters: 'types' }),

    displayLetters () {
      if (Array.isArray(this.letters)) {
        return this.letters
      } else {
        return []
      }
    }
  },

  async created () {
    await this.getLetters()
  },

  methods: {
    ...mapActions('admin/curriculum', {
      getLetters: 'getTypes'
    })
  }
}
</script>

<style lang="scss" scoped>
</style>
