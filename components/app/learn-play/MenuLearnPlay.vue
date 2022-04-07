<template>
  <v-row justify="center">
    <v-col cols="12">
      <img
        v-if="child"
        :alt="child.backpack.name"
        class="backpack-active"
        :src="child.backpack.image"
      >
    </v-col>
    <v-col cols="12">
      <span class="ml-8 font-weight-bold">
        {{ child.firstName }}
      </span>
    </v-col>
    <v-col cols="12">
      <img
        class="mt-4 ml-6"
        src="@/assets/png/lesson-letter.png"
      >
    </v-col>
    <v-col cols="12">
      <nuxt-link to="/secction">
        Sections
      </nuxt-link>
    </v-col>
    <v-col cols="12">
      <nuxt-link to="/secction">
        Video Lessons
      </nuxt-link>
    </v-col>
    <v-col cols="12">
      <nuxt-link to="/secction">
        Worksheets
      </nuxt-link>
    </v-col>
    <v-col cols="12">
      <nuxt-link to="/secction">
        DIY Project
      </nuxt-link>
    </v-col>
    <v-col cols="12">
      <nuxt-link to="/secction">
        Art Project
      </nuxt-link>
    </v-col>
    <v-col cols="12">
      <nuxt-link to="/secction">
        Snack with Description
      </nuxt-link>
    </v-col>
    <v-col cols="12">
      <nuxt-link to="/secction">
        Book
      </nuxt-link>
    </v-col>
    <v-col cols="12">
      <nuxt-link to="/secction">
        Playlist
      </nuxt-link>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'MenuLearnPlay',
  components: {},
  data: () => {
    return {
      loading: false
    }
  },
  computed: {
    ...mapGetters({ currentChild: 'getCurrentChild' }),
    ...mapGetters('admin/curriculum', { lesson: 'getLesson' }),
    ...mapGetters('children/lesson', {
      currentLessonId: 'getCurrentLessonId'
    }),
    childrenIds () {
      return (this.currentChild && this.currentChild.length) ? this.currentChild[0].id : 0
    },
    child () {
      return (this.currentChild && this.currentChild.length) ? this.currentChild[0] : null
    },
    curriculumTypeId () {
      if (this.lesson && this.lesson.curriculumType) {
        return this.lesson.curriculumType.id
      } else {
        return null
      }
    },
    currentVideo () {
      return (this.lesson && this.lesson.videos.length > 0) ? this.lesson.videos[0] : { videoUrl: null }
    },
    getOfflineWorksheet() {
      if (this.lesson) {
        return this.lesson.worksheets.filter(({ type }) => type === 'OFFLINE')
      }
      return []
    }
  },
  async created () {
    await this.getAllChildren()
    await this.handleLesson()
  },
  methods: {
    ...mapActions('children', { getAllChildren: 'get' }),
    ...mapActions('children/lesson', [
      'getCurrentLesson',
      'getCurrentLessonByChildrenId',
      'resetChild'
    ]),

    changeChild (newId, redirect = true) {
      const child = this.allChildren.find(({ id }) => id === parseInt(newId))
      this.setChild({ value: [child], save: true })
      if (redirect) {
        this.handleLesson(true).then(() => {
          // this.$router.push({ name: 'app-dashboard' })
          // this.redirectDashboard()
        })
      }
    },
    async handleLesson () {
      try {
        this.loading = true
        await this.getCurrentLesson({
          childrenIds: this.childrenIds
        })
      } catch (error) {
        return Promise.reject(error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
