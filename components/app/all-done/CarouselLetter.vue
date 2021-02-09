<template>
  <v-col cols="8" md="9">
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
            <letter :key="index" :item="item" :index="index" />
          </v-slide-item>
        </v-slide-group>
      </v-sheet>
    </v-row>
  </v-col>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Letter from '@/components/app/all-done/Letter.vue'

export default {
  name: 'CarouselLetter',

  components: {
    Letter
  },

  props: {
    value: {
      validator: (val) => {
        return typeof val === 'number' || val === null
      },
      default: null
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
      return this.letters.map((letter) => {
        const current = this.lettersProgress.find(l => l.id === letter.id)
        return {
          ...letter,
          ...current
        }
      })
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
