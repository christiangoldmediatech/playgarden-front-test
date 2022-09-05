<template>
  <v-row>
    <v-col class="text-center" cols="12">
      <img
        v-if="child"
        :alt="child.backpack.name"
        class="backpack-active"
        :src="child.backpack.image"
      >
    </v-col>
    <v-col class="text-center mt-n2" cols="12">
      <child-select v-model="childId" :show-only-selected-name="true" />
    </v-col>
    <v-col class="text-center mt-n6" cols="12">
      <recorded-letter
        v-if="getLetterCurriculumType"
        class="mt-6 rotated"
        v-bind="{ letter: getLetterCurriculumType, small: smallLetter }"
        list-mode
      />
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import RecordedLetter from '@/components/app/live-sessions/recorded/RecordedLetter.vue'
import ChildSelect from '@/components/app/ChildSelect.vue'

export default {
  name: 'PlayAndLearnMenuTop',
  components: {
    RecordedLetter,
    ChildSelect
  },
  props: {
    previewMode: {
      type: Boolean,
      default: false
    }
  },
  data: () => {
    return {
      loading: false,
      learnPlay: null,
      smallLetter: false,
      childId: null
    }
  },
  computed: {
    ...mapGetters({ currentChild: 'getCurrentChild' }),
    ...mapGetters('children', { children: 'rows' }),
    childrenIds() {
      return this.currentChild && this.currentChild.length
        ? this.currentChild[0].id
        : 0
    },
    child() {
      return this.currentChild && this.currentChild.length
        ? this.currentChild[0]
        : null
    },
    curriculumTypeId() {
      if (this.learnPlay && this.learnPlay.curriculumType) {
        return this.learnPlay.curriculumType.id
      } else {
        return null
      }
    },
    getLetterCurriculumType() {
      if (this.learnPlay && this.learnPlay.curriculumType) {
        return this.learnPlay.curriculumType
      } else {
        return null
      }
    }
  },
  watch: {
    childId(newId, oldId) {
      if (!oldId) { return }
      this.changeChild(newId)
    }
  },
  async created() {
    if (this.previewMode) {
      return
    }

    this.childId = this.child.id

    await this.getAllChildren()
    await this.handleLesson()

    this.$nuxt.$on('send-learn-play', (learnPlayCurrent) => {
      this.learnPlay = learnPlayCurrent
    })
  },

  beforeDestroy () {
    this.$nuxt.$off('send-learn-play')
  },
  methods: {
    ...mapActions('children', { getAllChildren: 'get' }),
    ...mapActions('children/learn-play', ['getFirstLearnPlay']),
    ...mapActions(['setChild']),

    changeChild(newId, redirect = true) {
      const child = this.children.find(({ id }) => id === parseInt(newId))
      this.setChild({ value: [child], save: true })
    },

    async handleLesson() {
      try {
        this.loading = true
        this.learnPlay = await this.getFirstLearnPlay()
      } catch (error) {
        return Promise.reject(error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.rotated {
  transform: rotate(-13.26deg) !important;
}
</style>
