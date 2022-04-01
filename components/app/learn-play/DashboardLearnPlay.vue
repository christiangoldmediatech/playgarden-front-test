<template>
  <v-card>
    <v-row>
      <v-col cols="10">
        carousel {{ lesson }}
      </v-col>
      <v-col cols="2">
        search
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="8">
        Video Lesson
        <v-row class="mt-4 ml-4">
          More like this
        </v-row>
      </v-col>
      <v-col cols="4">
        Worksheets
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import DashboardMixin from '@/mixins/DashboardMixin.js'

export default {
  name: 'DashboardLearnPlay',
  mixins: [DashboardMixin],
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
    }
  },
  async created () {
    // this.currentChild = this.currentChild[0].id
    await this.getAllChildren()
    console.log('currentChild---', this.currentChild)
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
        console.log('esra es--', this.childrenIds)
        // await this.getCurrentLessonByChildrenId({ lessonId: 1, childId: this.childrenIds })
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
