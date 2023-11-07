<template>
  <v-container fluid class="ma-0 pa-0 carousel-letter-wrapper">
    <unlock-prompt
      v-if="isCurrentLessonUnavailableInPlan && isRouteOnDailyLessons"
      class="pg-mt-[80px]"
      :title="$t('dailyLessons.unlockPrompt.title')"
      desc="$t('dailyLessons.unlockPrompt.description')"
      img="person-with-laptop.png"
    />
    <v-col class="hidden-sm-and-down ma-0 pa-0">
      <v-row justify="start" no-gutters>
        <v-sheet class="mx-auto" max-width="100%" min-width="100">
          <v-slide-group
            multiple
            show-arrows
            prev-icon="mdi-chevron-left accent--text"
            next-icon="mdi-chevron-right accent--text"
          >
            <v-slide-item
              v-for="(item, index) in listLetters"
              :key="index"
              :item="item"
              :index="index"
            >
              <letter :key="index" :item="item" :index="index" />
            </v-slide-item>
          </v-slide-group>
        </v-sheet>
      </v-row>
    </v-col>

    <v-col cols="12" class="hidden-md-and-up">
      <v-row no-gutters>
        <pg-select
          :value="value"
          :items="listLetters"
          item-value="id"
          hide-details
          solo
          :placeholder="$t('dailyLessons.carouselLetter.placeholder')"
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
                <v-list-item-title
                  v-if="item.picture"
                  class="font-weight-bold pl-4"
                >
                  {{ $t('commonWords.letter') }} {{ item.name }}
                </v-list-item-title>
                <v-list-item-title v-else class="font-weight-bold pl-4">
                  {{ $t('commonWords.letter') }} {{ item.name.substr(0, 1) }}
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
                  {{ $t('commonWords.letter') }} {{ item.name.substr(0, 1) }}
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
import {
  defineComponent,
  useStore,
  useRoute,
  useRouter
} from '@nuxtjs/composition-api'
import { mapGetters, mapActions } from 'vuex'
import Letter from '@/components/app/all-done/Letter.vue'
import RecordedLetter from '@/components/app/live-sessions/recorded/RecordedLetter.vue'
import { usePlanAccessHelpers } from '@/composables'
import UnlockPrompt from './UnlockPrompt.vue'

export default defineComponent({
  name: 'CarouselLetter',

  components: {
    Letter,
    RecordedLetter,
    UnlockPrompt
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

    isPlayAndLearn: {
      type: Boolean,
      required: false,
      default: false
    },

    loading: {
      type: Boolean,
      required: false,
      default: false
    },

    forceActivateAllLetters: {
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
    }, // this property only works if [forceActivateAllLetters] is false

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
  setup() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const { isCurrentLessonUnavailableInPlan } = usePlanAccessHelpers({
      store,
      route,
      router
    })
    return { isCurrentLessonUnavailableInPlan }
  },
  data: () => {
    return {
      lettersProgress: []
    }
  },

  computed: {
    ...mapGetters('admin/curriculum', { letters: 'types' }),

    ...mapGetters('auth', ['hasPlayAndLearnPlan']),

    ...mapGetters({ currentChild: 'getCurrentChild' }),

    listLetters() {
      const letters = this.letters.map((letter) => {
        if (!this.forceActivateAllLetters) {
          const current = this.lettersProgress.find((l) => l.id === letter.id)
          const isIncludedInDisabled = this.disabledLetters.includes(
            current?.id
          )
          const currentLetter = current
          if (currentLetter && isIncludedInDisabled) {
            currentLetter.disabled = true
            currentLetter.enabled = false
          }
          return {
            ...letter,
            ...currentLetter
          }
        } else {
          return {
            ...letter,
            disabled: false,
            enabled: true
          }
        }
      })

      if (this.hasPlayAndLearnPlan || this.isPlayAndLearn) {
        // Corresponds to Intro and Nature
        return letters.filter(
          (item) => item.letter !== 'In' && item.letter !== 'Nt'
        )
      } else {
        return letters
      }
    },

    studentId() {
      return this.currentChild[0].id
    },

    isRouteOnDailyLessons() {
      return this.$route.name.search('dashboard') > -1
    }
  },

  async created() {
    if (this.previewMode) {
      return
    }
    if (this.letters.length === 0) {
      await this.getLetters()
    }
    await this.fetchChildProgress()
  },

  methods: {
    ...mapActions('admin/curriculum', {
      getLetters: 'getTypes'
    }),
    ...mapActions('children/course-progress', [
      'getCourseProgressByChildId',
      'getPlayAndLearnProgressByChildId'
    ]),

    async fetchChildProgress() {
      if (this.previewMode) {
        return
      }
      let data = null

      if (this.isPlayAndLearn) {
        data = await this.getPlayAndLearnProgressByChildId({
          id: this.studentId
        })
      } else if (!this.currentChild[0].everyone) {
        data = await this.getCourseProgressByChildId({
          id: this.studentId
        })
      } else {
        data = await this.getCourseProgressByChildId({
          id: this.currentChild[0].allIds[0]
        })
      }

      this.lettersProgress = data.map((letter) => {
        return { ...letter, disabled: !letter.enabled }
      })
    }
  }
})
</script>

<style lang="scss" scoped>
.carousel-letter-wrapper {
  background: transparent;

  * {
    background: transparent;
  }
}
</style>
