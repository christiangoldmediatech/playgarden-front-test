<template>
  <v-card>
    <v-row>
      <v-col cols="10">
        <v-row no-gutters>
          <v-col cols="2" class="mt-2">
            <span class="title-dashboard font-weight-bold ml-8">Letter</span>
          </v-col>
          <v-col cols="10" class="mt-n2">
            <carousel-letter ref="CarouselLetter" :value="curriculumTypeId" />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="2">
        search
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="8">
        <span class="title-dashboard font-weight-bold ml-8">Video Lesson</span>
        <v-row class="mx-6 mt-3">
          <template v-if="currentVideo.videoUrl && currentVideo.videoUrl.HLS">
            <div class="learn-play-video">
              <pg-video-player
                :control-config="{ favorite: false }"
                inline
                @ready="onPlayerReady({ player: $event, video: currentVideo })"
              />
            </div>
          </template>
        </v-row>
        <v-row class="mt-4 ml-4">
          More like this
        </v-row>
      </v-col>
      <v-col cols="4">
        <span class="title-dashboard font-weight-bold">Worksheets</span>
        <offline-worksheets class="pt-2" :offline-worksheet-list="getOfflineWorksheet" />
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import CarouselLetter from '@/components/app/all-done/CarouselLetter.vue'
import OfflineWorksheets from '@/components/app/learn-play/OfflineWorksheets.vue'

export default {
  name: 'DashboardLearnPlay',
  components: {
    CarouselLetter,
    OfflineWorksheets
  },
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
    // this.currentChild = this.currentChild[0].id
    await this.getAllChildren()
    console.log('currentChild---', this.currentChild)
    await this.handleLesson()
    console.log('lesson--', this.lesson)
  },
  methods: {
    ...mapActions('children', { getAllChildren: 'get' }),
    ...mapActions('children/lesson', [
      'getCurrentLesson',
      'getCurrentLessonByChildrenId',
      'resetChild'
    ]),

    onPlayerReady ({ player, video }) {
      player.loadPlaylist([
        {
          title: video.name,
          poster: video.thumbnail,
          src: {
            url: video.videoUrl.HLS,
            type: 'application/x-mpegURL'
          }
        }
      ])
    },

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

<style scoped>
.title-dashboard {
  color: #606060 !important;
  font-size: 21px !important;
}

.learn-play-video {
  width: 95% !important;
  height: 369px !important;
}
</style>
