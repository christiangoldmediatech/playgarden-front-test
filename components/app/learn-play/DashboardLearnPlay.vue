<template>
  <v-card class="pb-10 mb-14">
    <v-row>
      <v-col cols="10">
        <v-row no-gutters>
          <v-col cols="2" class="mt-2 ml-n4">
            <span class="ml-8 title-dashboard font-weight-bold">Letter</span>
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
      <v-col ref="videoLesson" cols="8">
        <span class="title-dashboard font-weight-bold ml-4">Video Lesson</span>
        <v-row class="mx-2 mt-3 ml-4">
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

        <v-row v-if="lesson" class="mt-8 mx-2 ml-4">
          <span class="subtitle-dashboard font-weight-bold">More like this</span>
        </v-row>
        <v-row v-if="lesson">
          <videos-scroll :lesson="lesson" class="mt-3" @changeVideoTrack="changeVideoTrack" />
        </v-row>

        <v-row class="mx-4 my-14">
          <v-col cols="12">
            <v-row ref="diy" class="mt-5">
              <v-list class="ml-n4">
                <v-list-item>
                  <v-list-item-content>
                    <span class="title-dashboard font-weight-bold">
                      DIY Project
                    </span>
                    <v-img
                      class="pl-15 mt-n8 ml-7 clickable"
                      height="40px"
                      contain
                      :src="
                        require('@/assets/png/dashboard/download-worksheet.png')
                      "
                    />
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-row>
            <v-row>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
              </p>
            </v-row>
          </v-col>
          <v-row>
            <v-card width="93%" class="mt-5 ml-3">
              <v-row class="mx-2 my-2">
                <v-col cols="4">
                  <v-img
                    :src="require('@/assets/png/diy-1.png')"
                    max-width="150"
                    min-width="150"
                    height="250"
                  />
                </v-col>
                <v-col cols="4">
                  <v-img
                    :src="require('@/assets/png/diy-2.png')"
                    max-width="150"
                    min-width="150"
                    height="250"
                  />
                </v-col>
                <v-col cols="4">
                  <v-img
                    :src="require('@/assets/png/diy-3.png')"
                    max-width="150"
                    min-width="150"
                    height="250"
                  />
                </v-col>
              </v-row>
            </v-card>
          </v-row>
        </v-row>
        <v-row class="mb-10 ml-4">
          <v-col cols="12">
            <v-row ref="snack">
              <v-list class="ml-n4">
                <v-list-item>
                  <v-list-item-content>
                    <span class="title-dashboard font-weight-bold">
                      SNACK
                    </span>
                    <v-img
                      class="pl-15 mt-n8 ml-7"
                      height="40px"
                      contain
                      :src="
                        require('@/assets/png/dashboard/download-worksheet.png')
                      "
                    />
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-row>
            <p class="ml-n3">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
            </p>
          </v-col>
          <v-row>
            <v-card width="90%" class="mt-5 ml-3">
              <v-row class="mx-2 my-2">
                <v-col cols="4">
                  <v-img
                    :src="require('@/assets/png/snack-1.png')"
                    max-width="150"
                    min-width="150"
                    height="250"
                  />
                </v-col>
                <v-col cols="4">
                  <v-img
                    :src="require('@/assets/png/snack-2.png')"
                    max-width="150"
                    min-width="150"
                    height="250"
                  />
                </v-col>
                <v-col cols="4">
                  <v-img
                    :src="require('@/assets/png/snack-3.png')"
                    max-width="150"
                    min-width="150"
                    height="250"
                  />
                </v-col>
              </v-row>
            </v-card>
          </v-row>
        </v-row>
        <v-row class="mx-2 mt-12 ml-4">
          <span class="title-dashboard font-weight-bold">
            This week's recommended books
          </span>
          <p class="pr-8 mt-4">
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

          <v-row ref="book">
            <v-card width="92%" class="mt-5 ml-3">
              <v-row class="mx-2 my-2">
                <v-col cols="4">
                  <v-img
                    :src="require('@/assets/png/image-35.png')"
                    max-width="134"
                    min-width="134"
                    height="248"
                  />
                </v-col>
                <v-col cols="4">
                  <v-img
                    :src="require('@/assets/png/image-34.png')"
                    max-width="134"
                    min-width="134"
                    height="248"
                  />
                </v-col>
                <v-col cols="4">
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
        <div ref="worksheets" class="mr-4 card-offline">
          <offline-worksheets class="pt-2" :offline-worksheet-list="offlineWorksheetsList" />
        </div>

        <v-row class="my-14">
          <div ref="art-project" class="mt-3 ml-3">
            <span class="title-dashboard font-weight-bold pr-10">
              Art Project
            </span>
            <div class="ml-15">
              <v-img
                class="pl-15 mt-n8 ml-8 clickable"
                height="40px"
                contain
                :src="
                  require('@/assets/png/dashboard/download-worksheet.png')
                "
              />
            </div>
          </div>
          <p class="px-3 mt-3">
            Lorem ipsum dolor sit amet, consectetur adipiscing
          </p>
          <v-row class="mx-2 mt-4">
            <v-card class="justify-center ml-2 mr-8">
              <v-row justify="center" align="center" class="mt-2">
                <v-col class="ml-6" cols="12">
                  <center>
                    <v-img
                      :src="require('@/assets/png/art-1.png')"
                      max-width="230"
                      min-width="230"
                      height="153"
                    />
                  </center>
                </v-col>
                <v-col class="ml-6" cols="12">
                  <center>
                    <v-img
                      :src="require('@/assets/png/art-2.png')"
                      max-width="230"
                      min-width="230"
                      height="153"
                    />
                  </center>
                </v-col>
                <v-col class="mb-4 ml-6" cols="12">
                  <center>
                    <v-img
                      :src="require('@/assets/png/art-3.png')"
                      max-width="230"
                      min-width="230"
                      height="153"
                    />
                  </center>
                </v-col>
              </v-row>
            </v-card>
          </v-row>
        </v-row>
        <v-row no-gutters class="pt-3">
          <v-col cols="12">
            <div ref="playlist">
              <span class="title-dashboard font-weight-bold">
                Playlist
              </span>
              <div class="mt-4 ml-3 song-card">
                <songs-card />
              </div>
            </div>
          </v-col>
          <v-col cols="12">
            <div ref="topFive" class="mt-5">
              <span class="title-dashboard font-weight-bold">
                Top five
              </span>
              <top-five class="mt-n1" />
            </div>
          </v-col>
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
      section: 'videoLesson',
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
  watch: {
    section (val) {
      this.scrollMeTo(val)
    }
  },
  async created () {
    await this.getAllChildren()
    await this.handleLesson()
    this.loadCurrentVideo()
    this.offlineWorksheetsList = await this.getRandomWorksheet()

    this.$nuxt.$on('menu-section', (section) => {
      this.scrollMeTo(section)
    })
  },

  beforeDestroy () {
    this.$nuxt.$off('menu-section')
  },

  methods: {
    ...mapActions('offline-worksheet', ['getRandomWorksheet']),
    ...mapActions('children', { getAllChildren: 'get' }),
    ...mapActions('children/lesson', [
      'getCurrentLesson',
      'getCurrentLessonByChildrenId',
      'resetChild'
    ]),

    scrollMeTo(refName) {
      const element = this.$refs[refName]
      const top = element.offsetTop
      window.scrollTo(0, top)
    },

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
.subtitle-dashboard {
  color: #606060 !important;
  font-size: 18px !important;
}

.learn-play-video {
  width: 95% !important;
  height: 369px !important;
}

.song-card {
  max-width: 85% !important;
  min-width: 85% !important;
  min-height: 554px !important;
  max-height: 554px !important;
}
</style>
