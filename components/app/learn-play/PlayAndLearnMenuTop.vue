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
      <span v-if="child" class="font-weight-bold child-name">
        {{ child.firstName }}
      </span>
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

export default {
  name: 'PlayAndLearnMenuTop',
  components: {
    RecordedLetter
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
      smallLetter: false
    }
  },
  computed: {
    ...mapGetters({ currentChild: 'getCurrentChild' }),
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
  async created() {
    if (this.previewMode) {
      return
    }

    await this.getAllChildren()
    await this.handleLesson()
  },
  methods: {
    ...mapActions('children', { getAllChildren: 'get' }),
    ...mapActions('children/learn-play', ['getFirstLearnPlay']),

    changeChild(newId, redirect = true) {
      const child = this.allChildren.find(({ id }) => id === parseInt(newId))
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
.child-name {
  color: #7852b5 !important;
  font-size: 28px !important;
}

.rotated {
  transform: rotate(-13.26deg) !important;
}
</style>
