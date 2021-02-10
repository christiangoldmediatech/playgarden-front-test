<template>
  <v-container fluid>
    <v-col class="hidden-sm-and-down">
      <v-row justify="start" no-gutters>
        <v-sheet class="mx-auto" max-width="100%" min-width="100">
          <v-slide-group
            multiple
            show-arrows
            prev-icon="mdi-chevron-left accent--text"
            next-icon="mdi-chevron-right accent--text"
          >
            <v-slide-item
              v-for="(item, index) in actualLetters"
              :key="index"
              :item="item"
              :index="index"
            >
              <v-img
                v-if="item.asImage"
                :key="index"
                width="70"
                height="70"
                contain
                :src="item.icon"
              />

              <letter v-else :key="index" :item="item" :index="index" />
            </v-slide-item>
          </v-slide-group>
        </v-sheet>
      </v-row>
    </v-col>

    <v-col cols="12" class="hidden-md-and-up">
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
                <v-list-item-title class="font-weight-bold pl-4">
                  Letter {{ item.name.substr(0, 1) }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>

          <template v-slot:item="{ item, on, attrs }">
            <v-img
              v-if="item.asImage"
              width="70"
              height="70"
              contain
              :src="item.icon"
              @click.stop=""
            />

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
    </v-col>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Letter from '@/components/app/all-done/Letter.vue'
import RecordedLetter from '@/components/app/live-sessions/recorded/RecordedLetter.vue'

export default {
  name: 'CarouselLetter',

  components: {
    Letter,
    RecordedLetter
  },

  props: {
    value: {
      validator: (val) => {
        return typeof val === 'number' || val === null
      },
      required: true
    },

    lesson: {
      validator: (val) => {
        return typeof val === 'object' || val === null
      },
      default: null
    },

    loading: {
      type: Boolean,
      required: false,
      default: false
    },

    previewMode: {
      type: Boolean,
      required: false,
      default: false
    },

    disabledLetters: {
      type: Array,
      required: false,
      default: () => []
    },

    childId: {
      validator: (val) => {
        return val === null || typeof val === 'number'
      },
      required: false,
      default: null
    },
    slimVersion: {
      type: Boolean,
      required: false,
      default: false
    },

    smallLetter: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data: () => {
    return {
      lettersProgress: []
    }
  },

  computed: {
    ...mapGetters('admin/curriculum', { letters: 'types' }),

    ...mapGetters({ currentChild: 'getCurrentChild' }),

    actualLetters () {
      const letters = this.letters.map((letter) => {
        const current = this.lettersProgress.find(l => l.id === letter.id)
        return {
          ...letter,
          ...current
        }
      })

      letters.splice(4, 0, {
        asImage: true,
        icon: require('@/assets/svg/carousel-letters/nature.svg'),
        letter: '',
        name: '',
        disabled: false
      })

      return letters
    },

    studentId () {
      return this.currentChild[0].id
    }
  },

  async created () {
    await this.getLetters()
    await this.fetchChildProgress()
  },

  methods: {
    ...mapActions('admin/curriculum', {
      getLetters: 'getTypes'
    }),
    ...mapActions('children/course-progress', ['getCourseProgressByChildId']),

    async fetchChildProgress () {
      const data = await this.getCourseProgressByChildId({
        id: this.studentId
      })

      this.lettersProgress = data.map((letter) => {
        return { ...letter, disabled: !letter.enabled }
      })
    }
  }
}
</script>
