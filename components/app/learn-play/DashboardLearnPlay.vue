<template>
  <v-card class="pb-10 mb-14">
    <v-row>
      <v-col v-if="!$vuetify.breakpoint.mdAndUp" cols="12">
        <menu-mobile />
      </v-col>
      <v-col cols="12" md="10">
        <v-row no-gutters>
          <v-col cols="12" md="2" class="mt-2 ml-n4">
            <span class="ml-8 title-dashboard font-weight-bold">Letter</span>
          </v-col>
          <v-col cols="12" md="10" class="mt-n2">
            <carousel-letter ref="CarouselLetter" :value="curriculumTypeId" />
          </v-col>
        </v-row>
      </v-col>
      <v-col v-if="!$vuetify.breakpoint.mobile" cols="2" class="pr-8">
        <pg-text-field
          label="Search"
          solo-labeled
        />
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col ref="videoLesson" cols="12" md="8">
        <span class="ml-4 title-dashboard font-weight-bold">Video Lesson</span>
        <v-row class="mx-2 mt-3 ml-4">
          <template v-if="learnPlayData && learnPlayData.videos.length > 0">
            <div class="learn-play-video">
              <pg-video-player
                :control-config="{ favorite: false }"
                inline
                :auto-track-change="true"
                @ready="onPlayerReady({ player: $event, videos: learnPlayData.videos })"
              />
            </div>
          </template>
          <v-card v-else width="100%">
            <v-skeleton-loader
              type="card"
            />
          </v-card>
        </v-row>

        <v-row v-if="learnPlayData" class="mx-2 mt-8 ml-4">
          <span class="subtitle-dashboard font-weight-bold">More like this</span>
        </v-row>
        <v-row v-if="learnPlayData">
          <videos-scroll :learn-play="learnPlayData" class="mt-3" @changeVideoTrack="changeVideoTrack" />
        </v-row>

        <v-row v-if="!$vuetify.breakpoint.smAndUp">
          <v-col cols="12" class="mt-6">
            <span class="mx-4 title-dashboard font-weight-bold">Worksheets</span>
            <div v-if="getOfflineWorksheet.length > 0" ref="worksheets">
              <offline-worksheets class="mx-3 mt-4" :offline-worksheet-list="getOfflineWorksheet" />
            </div>
          </v-col>
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
                        require('@/assets/png/dashboard/download-ico.png')
                      "
                      @click="downloadDiyFiles"
                    />
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-row>
            <v-row>
              <p v-if="getDiyProject.length > 0">
                {{ getDiyProject[0].description }}
              </p>
            </v-row>
          </v-col>
          <v-row>
            <v-card width="93%" class="mt-5 ml-3">
              <v-row v-if="getDiyProject.length > 0" class="mx-2 my-2">
                <v-col
                  v-for="(diy, index) in getDiyProject"
                  :key="`diy-item-${index}`"
                  cols="12"
                  md="12"
                >
                  <center>
                    <v-img
                      :src="diy.image"
                    />
                  </center>
                </v-col>
              </v-row>
              <v-row v-else class="mx-2 my-2">
                <v-col
                  v-for="n in 3"
                  :key="`diy-load-item-${n}`"
                  cols="4"
                >
                  <v-skeleton-loader
                    type="image"
                  />
                </v-col>
              </v-row>
            </v-card>
          </v-row>
        </v-row>
        <v-row v-if="!$vuetify.breakpoint.smAndUp">
          <v-col cols="12">
            <div ref="art-project" class="mt-3 ml-3">
              <span class="pr-10 title-dashboard font-weight-bold">
                Art Project
              </span>
              <div>
                <v-img
                  class="mt-n8 ml-n6 clickable"
                  height="40px"
                  contain
                  :src="
                    require('@/assets/png/dashboard/download-ico.png')
                  "
                  @click="downloadArtFiles"
                />
              </div>
            </div>
          </v-col>
          <v-col cols="12">
            <p v-if="getArtProjects.length >0" class="px-3 mt-3 text-justify">
              {{ getArtProjects[0].description }}
            </p>
          </v-col>
          <v-row class="mx-2 mx-3 my-4">
            <v-card v-if="getArtProjects.length >0" width="93%" class="mt-5 ml-3">
              <v-row
                v-for="(art, index) in getArtProjects"
                :key="`art-project-${index}`"
                justify="center"
                align="center"
                class="my-4"
              >
                <v-col cols="12">
                  <center>
                    <v-img
                      :src="art.image"
                    />
                  </center>
                </v-col>
              </v-row>
            </v-card>
            <v-card v-else class="justify-center ml-2 mr-8" width="100%">
              <v-row
                v-for="n in 3"
                :key="`art-load-project-${n}`"
                justify="center"
                align="center"
                class="my-4"
              >
                <v-card width="70%">
                  <v-skeleton-loader
                    type="image"
                  />
                </v-card>
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
                      class="ml-3 pl-15 mt-n8 clickable"
                      height="40px"
                      contain
                      :src="
                        require('@/assets/png/dashboard/download-ico.png')
                      "
                      @click="downloadSnackFiles"
                    />
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-row>
            <p v-if="getSnacks.length > 0" class="ml-n3">
              {{ getSnacks[0].description }}
            </p>
          </v-col>
          <v-row>
            <v-card :width="$vuetify.breakpoint.mobile ? '88%' : '90%'" :class="$vuetify.breakpoint.mobile ? 'ml-2' : 'mt-5 ml-3'">
              <v-row
                v-if="getSnacks.length > 0"
                justify="center"
                align="center"
                class="mx-2 my-2"
              >
                <v-col
                  v-for="(snack, index) in getSnacks"
                  :key="`snack-item-${index}`"
                  cols="12"
                >
                  <center>
                    <v-img
                      :src="snack.image"
                    />
                  </center>
                </v-col>
              </v-row>
              <v-row v-else class="mx-2 my-2">
                <v-col
                  v-for="n in 3"
                  :key="`snack-load-item-${n}`"
                  cols="12"
                  md="4"
                >
                  <v-skeleton-loader
                    type="image"
                  />
                </v-col>
              </v-row>
            </v-card>
          </v-row>
        </v-row>
        <v-row no-gutters class="mx-2 mt-12 ml-4">
          <v-col cols="12">
            <span class="title-dashboard font-weight-bold">
              This week's recommended books
            </span>
          </v-col>
          <v-col cols="12" class="mt-3">
            <p v-if="getBook" class="text-justify">
              {{ getBook.description }}
            </p>
          </v-col>
          <template v-if="currentBookVideo.videoUrl && currentBookVideo.videoUrl.HLS">
            <div class="learn-play-video">
              <pg-video-player
                :control-config="{ favorite: false }"
                inline
                @ready="onPlayerReadyTwo({ player: $event, video: currentBookVideo })"
              />
            </div>
          </template>
          <v-card v-else width="100%">
            <v-skeleton-loader
              type="card"
            />
          </v-card>

          <v-row ref="book">
            <v-card width="92%" class="mt-5 ml-3">
              <v-row v-if="getRelatedBooks.length" class="mx-2 my-2">
                <v-col
                  v-for="(book, index) in getRelatedBooks"
                  :key="`book-item-${index}`"
                  cols="12"
                  md="4"
                >
                  <center>
                    <v-img
                      :src="book.image"
                      height="248"
                    />
                  </center>
                </v-col>
              </v-row>
              <v-row v-else class="mx-2 my-2">
                <v-col
                  v-for="n in 3"
                  :key="`book-load-item-${n}`"
                  cols="4"
                >
                  <v-skeleton-loader
                    type="image"
                  />
                </v-col>
              </v-row>
            </v-card>
          </v-row>
        </v-row>

        <v-row v-if="!$vuetify.breakpoint.smAndUp">
          <v-col cols="12" class="mt-6">
            <div ref="playlist">
              <span class="ml-4 title-dashboard font-weight-bold">
                Playlist
              </span>
              <div v-if="learnPlayData && learnPlayData.songs" class="mt-5 mobile-play">
                <center>
                  <songs-card class="song-card" />
                </center>
              </div>
            </div>
          </v-col>
          <v-col cols="12" class="mx-6">
            <div ref="topFive" class="mt-5">
              <span class="title-dashboard font-weight-bold">
                Top five
              </span>
              <top-five v-if="songs && songs.length > 0" class="mt-n1" :songs="songs" />
              <div v-else>
                <v-card
                  v-for="n in 5"
                  :key="`song-load-item-${n}`"
                  class="my-3"
                  cols="4"
                >
                  <v-skeleton-loader
                    type="list-item-avatar"
                  />
                </v-card>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-col>
      <v-col
        v-if="$vuetify.breakpoint.mdAndUp"
        cols="4"
      >
        <span class="title-dashboard font-weight-bold">Worksheets</span>
        <div v-if="getOfflineWorksheet.length > 0" ref="worksheets" class="mr-4 card-offline">
          <offline-worksheets class="pt-2" :offline-worksheet-list="getOfflineWorksheet" />
        </div>
        <div v-else>
          <v-card
            v-for="n in 3"
            :key="`worksheet-load-item-${n}`"
            class="my-3"
            cols="4"
          >
            <v-skeleton-loader
              type="list-item-avatar"
            />
          </v-card>
        </div>

        <v-row no-gutters class="my-14">
          <v-col cols="12">
            <div ref="art-project" class="mt-3 ml-1">
              <span class="pr-10 title-dashboard font-weight-bold">
                Art Project
              </span>
              <div>
                <v-img
                  class="mt-n8 clickable"
                  height="40px"
                  contain
                  :src="
                    require('@/assets/png/dashboard/download-ico.png')
                  "
                  @click="downloadArtFiles"
                />
              </div>
            </div>
          </v-col>
          <v-col cols="12">
            <p v-if="getArtProjects.length >0" class="mx-1 mt-3 text-justify">
              {{ getArtProjects[0].description }}
            </p>
          </v-col>
          <v-row class="mx-1 mt-4">
            <v-card v-if="getArtProjects.length >0" class="justify-center" width="96%">
              <v-row
                v-for="(art, index) in getArtProjects"
                :key="`art-project-${index}`"
                justify="center"
                align="center"
                class="my-4"
              >
                <center>
                  <v-img
                    :src="art.image"
                    max-width="230"
                    min-width="230"
                    height="153"
                  />
                </center>
              </v-row>
            </v-card>
            <v-card v-else class="justify-center ml-2 mr-8" width="100%">
              <v-row
                v-for="n in 3"
                :key="`art-load-project-${n}`"
                justify="center"
                align="center"
                class="my-4"
              >
                <v-card width="70%">
                  <v-skeleton-loader
                    type="image"
                  />
                </v-card>
              </v-row>
            </v-card>
          </v-row>
        </v-row>
        <v-card class="mr-4">
          <v-row no-gutters class="pt-3">
            <v-col cols="12">
              <div ref="playlist">
                <span class="title-dashboard font-weight-bold ml-9">
                  Playlist
                </span>
                <div v-if="learnPlayData && learnPlayData.songs" class="mt-4 ml-3">
                  <center>
                    <songs-card class="song-card" />
                  </center>
                </div>
              </div>
            </v-col>
            <v-col cols="12" class="my-5">
              <div ref="topFive" class="mt-5">
                <span class="title-dashboard font-weight-bold ml-9">
                  Top five
                </span>
                <top-five v-if="songs && songs.length > 0" class="mt-1 ml-6" :songs="songs" />
                <div v-else>
                  <v-card
                    v-for="n in 5"
                    :key="`song-load-item-${n}`"
                    class="my-3"
                    cols="4"
                  >
                    <v-skeleton-loader
                      type="list-item-avatar"
                    />
                  </v-card>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import PgVideoPlayer from '@gold-media-tech/pg-video-player'
import CarouselLetter from '@/components/app/all-done/CarouselLetter.vue'
import OfflineWorksheets from '@/components/app/learn-play/OfflineWorksheets.vue'
import VideosScroll from '@/components/app/learn-play/VideosScroll.vue'
import TopFive from '@/components/app/learn-play/TopFive.vue'
import SongsCard from '@/components/app/learn-play/SongsCard.vue'
import MenuMobile from '@/components/app/learn-play/MenuMobile.vue'

export default {
  name: 'DashboardLearnPlay',
  components: {
    PgVideoPlayer,
    CarouselLetter,
    OfflineWorksheets,
    VideosScroll,
    TopFive,
    SongsCard,
    MenuMobile
  },
  data: () => {
    return {
      learnPlayData: null,
      section: 'videoLesson',
      loading: false,
      currentFile: null,
      player: null,
      noLinkMode: false,
      playerTwo: null,
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

    childrenIds () {
      return (this.currentChild && this.currentChild.length) ? this.currentChild[0].id : 0
    },
    curriculumTypeId () {
      if (this.learnPlayData && this.learnPlayData.curriculumType) {
        return this.learnPlayData.curriculumType.id
      } else {
        return null
      }
    },
    songs () {
      return (this.learnPlayData && this.learnPlayData.songs.length > 0) ? this.learnPlayData.songs : []
    },
    getDiyProject() {
      return (this.learnPlayData && this.learnPlayData.files.length > 0) ? this.learnPlayData.files.filter(file => file.type === 'DIY_PROJECT') : []
    },
    getSnacks() {
      return (this.learnPlayData && this.learnPlayData.files.length > 0) ? this.learnPlayData.files.filter(file => file.type === 'SNACK') : []
    },
    getArtProjects() {
      return (this.learnPlayData && this.learnPlayData.files.length > 0) ? this.learnPlayData.files.filter(file => file.type === 'ART_PROJECT') : []
    },
    getOfflineWorksheet() {
      if (this.learnPlayData && this.learnPlayData.worksheets.length > 0) {
        return this.learnPlayData.worksheets
      }
      return []
    },
    getRelatedBooks() {
      return (this.learnPlayData && this.learnPlayData.books.length > 0) ? this.learnPlayData.books[0].relatedBooks : []
    },
    getBook() {
      return (this.learnPlayData && this.learnPlayData.books.length > 0) ? this.learnPlayData.books[0] : null
    },
    currentBookVideo () {
      return (this.learnPlayData && this.learnPlayData.books.length > 0)
        ? this.learnPlayData.books[0].video
        : {
            videoUrl: {
              HLS: null
            }
          }
    }
  },
  watch: {
    section (val) {
      this.scrollMeTo(val)
    }
  },
  async created () {
    await this.getAllChildren()
    await this.loadLearnPlay()
    this.loadCurrentVideo()
    this.$nuxt.$on('menu-section', (section) => {
      this.scrollMeTo(section)
    })
  },

  beforeDestroy () {
    this.$nuxt.$off('menu-section')
  },

  methods: {
    ...mapActions('offline-worksheet', ['getRandomWorksheet']),
    ...mapActions('children/learn-play', [
      'getFirstLearnPlay'
    ]),
    ...mapActions('children', { getAllChildren: 'get' }),

    async loadLearnPlay () {
      try {
        this.learnPlayData = await this.getFirstLearnPlay()
        if (this.learnPlayData && this.learnPlayData.songs) {
          this.learnPlayData.songs.map((song) => {
            this.buildPlaySongList(song)
          })
        }
      } catch (error) {
      }
    },

    scrollMeTo(refName) {
      const element = this.$refs[refName]
      const top = element.offsetTop
      window.scrollTo(0, top)
    },

    downloadDiyFiles () {
      this.getDiyProject.map((file) => {
        this.handleDownloadClick(file)
      })
    },

    downloadSnackFiles () {
      this.getSnacks.map((file) => {
        this.handleDownloadClick(file)
      })
    },

    downloadArtFiles () {
      this.getArtProjects.map((file) => {
        this.handleDownloadClick(file)
      })
    },

    openPdf () {
      if (this.currentFile) {
        window.open(this.currentFile.file, '_blank')
      }
    },

    handleDownloadClick(item) {
      this.currentFile = item
      if (!this.noLinkMode) {
        this.openPdf()
      }
    },

    loadCurrentVideo () {
      this.currentVideo = (this.learnPlayData && this.learnPlayData.videos.length > 0) ? this.learnPlayData.videos[0] : { videoUrl: null }
    },

    setCurrentVideo (video) {
      this.currentVideo = video
    },

    buildPlaySongList (song) {
      this.$emit('addSong', song)
    },

    buildPlayVideoList (videos) {
      return videos.map((video) => {
        return {
          title: video.name,
          poster: video.thumbnail,
          src: {
            url: video.videoUrl.HLS,
            type: 'application/x-mpegURL'
          }
        }
      })
    },

    onPlayerReady ({ player, videos }) {
      this.player = player
      const playVideoList = this.buildPlayVideoList(videos)
      player.loadPlaylist(playVideoList)
    },

    onPlayerReadyTwo ({ player, video }) {
      this.playerTwo = player
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
  min-height: 328px !important;
  max-height: 328px !important;
}

.mobile-play {
  width: 100% !important;
}
</style>
