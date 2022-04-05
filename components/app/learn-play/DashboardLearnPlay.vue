<template>
  <v-card class="mb-14 pb-10">
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
      <v-col cols="2" class="pr-8">
        <pg-text-field
          label="Search"
          solo-labeled
        />
      </v-col>
    </v-row>
    <v-row no-gutters>
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
          <span class="title-dashboard font-weight-bold ml-8">More like this</span>
          <v-row v-if="lesson" class="mt-3">
            <videos-scroll :lesson="lesson" class="mt-3" @changeVideoTrack="changeVideoTrack" />
          </v-row>
        </v-row>
        <v-row class="mt-14 ml-4">
          <div>
            <span class="title-dashboard font-weight-bold">
              DIY Project
            </span>
            <div class="ml-15">
              <v-img
                class="pl-15 mt-n8 ml-10"
                height="40px"
                contain
                :src="
                  require('@/assets/png/dashboard/download-worksheet.png')
                "
              />
            </div>
          </div>
          <p class="mt-3">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
          </p>
          <v-row>
            <v-card width="100%" class="mt-5 px-4">
              <v-row class="my-2">
                <v-col cols="4">
                  <v-img
                    :src="require('@/assets/png/diy-1.png')"
                    max-width="165"
                    min-width="165"
                    height="250"
                  />
                </v-col>
                <v-col cols="4">
                  <v-img
                    :src="require('@/assets/png/diy-2.png')"
                    max-width="180"
                    min-width="180"
                    height="250"
                  />
                </v-col>
                <v-col cols="4">
                  <v-img
                    :src="require('@/assets/png/diy-3.png')"
                    max-width="180"
                    min-width="180"
                    height="250"
                  />
                </v-col>
              </v-row>
            </v-card>
          </v-row>
        </v-row>
        <v-row class="mt-14 ml-4 mb-10">
          <div>
            <span class="title-dashboard font-weight-bold">
              SNACK
            </span>
            <div class="ml-15">
              <v-img
                class="pl-15 mt-n8 ml-5"
                height="40px"
                contain
                :src="
                  require('@/assets/png/dashboard/download-worksheet.png')
                "
              />
            </div>
          </div>
          <p class="mt-3">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
          </p>
          <v-row>
            <v-card width="100%" class="mt-5 px-4">
              <v-row class="my-2">
                <v-col cols="4">
                  <v-img
                    :src="require('@/assets/png/snack-1.png')"
                    max-width="165"
                    min-width="165"
                    height="250"
                  />
                </v-col>
                <v-col cols="4">
                  <v-img
                    :src="require('@/assets/png/snack-2.png')"
                    max-width="180"
                    min-width="180"
                    height="250"
                  />
                </v-col>
                <v-col cols="4">
                  <v-img
                    :src="require('@/assets/png/snack-3.png')"
                    max-width="180"
                    min-width="180"
                    height="250"
                  />
                </v-col>
              </v-row>
            </v-card>
          </v-row>
        </v-row>
        <v-row class="mt-12 ml-4">
          <span class="title-dashboard font-weight-bold">
            This week's recommended books
          </span>
          <p class="mt-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim-
          </p>
          <template v-if="currentVideo.videoUrl && currentVideo.videoUrl.HLS">
            <div class="learn-play-video">
              <pg-video-player
                :control-config="{ favorite: false }"
                inline
                @ready="onPlayerReadyTwo({ player: $event, video: currentVideo })"
              />
            </div>
          </template>

          <v-row>
            <v-card width="100%" class="mt-5 px-4">
              <v-row class="my-2">
                <v-col cols="4">
                  <v-img
                    :src="require('@/assets/png/image-33.png')"
                    max-width="200"
                    min-width="200"
                    height="198"
                  />
                </v-col>
                <v-col cols="4" class="mt-n4 pl-10">
                  <v-img
                    :src="require('@/assets/png/image-34.png')"
                    max-width="134"
                    min-width="134"
                    height="248"
                  />
                </v-col>
                <v-col cols="4" class="mt-n4">
                  <v-img
                    :src="require('@/assets/png/image-35.png')"
                    max-width="134"
                    min-width="134"
                    height="248"
                  />
                </v-col>
              </v-row>
            </v-card>
          </v-row>
        </v-row>
      </v-col>
      <v-col
        cols="4"
      >
        <span class="title-dashboard font-weight-bold">Worksheets</span>
        <offline-worksheets class="pt-2" :offline-worksheet-list="offlineWorksheetsList" />

        <v-row>
          <div class="ml-3">
            <span class="title-dashboard font-weight-bold">
              Art Project
            </span>
            <div class="ml-15">
              <v-img
                class="pl-15 mt-n8 ml-7"
                height="40px"
                contain
                :src="
                  require('@/assets/png/dashboard/download-worksheet.png')
                "
              />
            </div>
          </div>
          <p class="mt-3 mx-3">
            Lorem ipsum dolor sit amet, consectetur adipiscing
          </p>
          <v-row class="mt-4 mx-6">
            <v-card class="ml-10 mr-8">
              <v-row justify="center" align="center" class="mt-2">
                <v-col class="ml-6" cols="12">
                  <v-img
                    :src="require('@/assets/png/art-1.png')"
                    max-width="230"
                    min-width="230"
                    height="153"
                  />
                </v-col>
                <v-col class="ml-6" cols="12">
                  <v-img
                    :src="require('@/assets/png/art-2.png')"
                    max-width="230"
                    min-width="230"
                    height="153"
                  />
                </v-col>
                <v-col class="ml-6 mb-4" cols="12">
                  <v-img
                    :src="require('@/assets/png/art-3.png')"
                    max-width="230"
                    min-width="230"
                    height="153"
                  />
                </v-col>
              </v-row>
            </v-card>
          </v-row>
        </v-row>
        <v-row class="mt-10 ml-14">
          <span class="title-dashboard font-weight-bold">
            Playlist
          </span>
          <div class="ml-n1 mt-4 mb-14 song-card">
            <songs-card
              class="pb-6"
              :selected-song="selectedSong"
            />
          </div>
        </v-row>
        <v-row class="mt-16">
          <div class="mt-16">
            <span class="title-dashboard font-weight-bold ml-14 ">
              Top five
            </span>
            <top-five class="mt-10 ml-8 mt-n1" />
          </div>
        </v-row>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import CarouselLetter from '@/components/app/all-done/CarouselLetter.vue'
import OfflineWorksheets from '@/components/app/learn-play/OfflineWorksheets.vue'
import VideosScroll from '@/components/app/learn-play/VideosScroll.vue'
import TopFive from '@/components/app/learn-play/TopFive.vue'
import SongsCard from '@/components/app/learn-play/SongsCard.vue'

export default {
  name: 'DashboardLearnPlay',
  components: {
    CarouselLetter,
    OfflineWorksheets,
    VideosScroll,
    TopFive,
    SongsCard
  },
  data: () => {
    return {
      loading: false,
      player: null,
      offlineWorksheetsList: [],
      currentVideo: {
        videoUrl: {
          HLS: null
        }
      }
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
    this.loadCurrentVideo()
    this.offlineWorksheetsList = await this.getRandomWorksheet(this.lesson.id)
  },
  methods: {
    ...mapActions('offline-worksheet', ['getRandomWorksheet']),
    ...mapActions('children', { getAllChildren: 'get' }),
    ...mapActions('children/lesson', [
      'getCurrentLesson',
      'getCurrentLessonByChildrenId',
      'resetChild'
    ]),

    loadCurrentVideo () {
      this.currentVideo = (this.lesson && this.lesson.videos.length > 0) ? this.lesson.videos[0] : { videoUrl: null }
    },

    setCurrentVideo (video) {
      this.currentVideo = video
    },

    onPlayerReady ({ player, video }) {
      this.player = player
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

    onPlayerReadyTwo ({ player, video }) {
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

    changeVideoTrack (video) {
      if (!this.player) {
        return
      }
      this.player.loadPlaylist([
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
.song-card {
  max-width: 280px !important;
  min-width: 280px !important;
  height: 372px !important;
}
</style>
