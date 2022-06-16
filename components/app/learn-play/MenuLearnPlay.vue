<template>
  <v-row class="menu-learn-play" justify="center">
    <v-col class="text-center" cols="12">
      <img
        v-if="child"
        :alt="child.backpack.name"
        class="backpack-active"
        :src="child.backpack.image"
      >
    </v-col>
    <v-col class="text-center mt-n8" cols="12">
      <span v-if="child" class="font-weight-bold name-child">
        {{ child.firstName }}
      </span>
    </v-col>
    <v-col class="text-center mt-n6" cols="12">
      <recorded-letter
        v-if="getLetterCurriculumType"
        class="mt-6 rotate"
        v-bind="{ letter: getLetterCurriculumType, small: smallLetter }"
        list-mode
      />
    </v-col>
    <v-col cols="12">
      <span class="color-main" @click="sendSection('videoLesson')">
        Sections
      </span>
    </v-col>
    <v-col cols="12">
      <span class="color-menu clickable" @click="sendSection('videoLesson')">
        Video Lessons
      </span>
    </v-col>
    <v-col cols="12">
      <span class="color-menu clickable" @click="sendSection('worksheets')">
        Worksheets
      </span>
    </v-col>
    <v-col cols="12">
      <span class="color-menu clickable" @click="sendSection('diy')">
        DIY Project
      </span>
    </v-col>
    <v-col cols="12">
      <span class="color-menu clickable" @click="sendSection('art-project')">
        Art Project
      </span>
    </v-col>
    <v-col cols="12">
      <span class="color-menu clickable" @click="sendSection('snack')">
        Snack of the Week
      </span>
    </v-col>
    <v-col cols="12">
      <span class="color-menu clickable" @click="sendSection('book')">
        Book
      </span>
    </v-col>
    <v-col cols="12">
      <span class="color-menu clickable" @click="sendSection('playlist')">
        Playlist
      </span>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import RecordedLetter from '@/components/app/live-sessions/recorded/RecordedLetter.vue'

export default {
  name: 'MenuLearnPlay',
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

    sendSection(section) {
      this.$nuxt.$emit('menu-section', section)
    },

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
.color-main {
  color: var(--v-primary-base) !important;
  font-weight: 800;
}
.color-menu {
  color: var(--v-primary-base) !important;
  font-weight: 600;
}
.name-child {
  color: #7852b5 !important;
  font-size: 28px !important;
}
/* .menu-learn-play {
  position: sticky;
  top: 116px;
  max-height: calc(100vh - 128px);
  margin-bottom: 0px;
  overflow-x: hidden;
  overflow-y: auto;
} */
.rotate {
  transform: rotate(-13.26deg) !important;
}
</style>
