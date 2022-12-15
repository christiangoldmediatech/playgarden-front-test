<template>
  <v-card class="d-flex flex-column dashboard-content-card" height="100%">
    <div
      class="ofws-header offline-worksheet-image"
      :style="{ '--offlineWorksheetThumbnailUrl': `url(${require('@/assets/jpg/worksheets_completed_1.jpg')})` }"
      @click.stop="showVideo"
    >
      <template v-if="offlineWorksheet && offlineWorksheet.videoDetail">
        <v-hover v-slot="{ hover }">
          <img
            :class="['ofws-icon play-icon-v2 no-background', { 'scaled-play-icon': hover }]"
            src="@/assets/svg/play-button-icon-v2.svg"
            width="100%"
          >
        </v-hover>
        <div class="text-center ofws-content">
          <underlined-title
            class="white--text"
            font-size="56px"
            font-weight="bold"
            text="Watch the Worksheet Video"
          />
          <p class="white--text text-center">
            Complete your hands-on worksheets with a Playgarden Prep teacher!
          </p>
        </div>
      </template>
      <template v-else>
        <underlined-title
          class="white--text"
          font-size="56px"
          font-weight="bold"
          text="Hands-on Learning"
        />
        <p class="white--text text-center">
          Hands-on learning is a crucial part of the educational experience. Learning through doing strengthens the cognitive connections and builds a strong foundation for knowledge.
        </p>
      </template>
    </div>
    <v-container>
      <v-row class="flex-column" align="center">
        <h5 class="text-h5 font-weight-bold text-center">
          What do you want to do next?
        </h5>

        <v-col
          v-for="(button, i) in buttons"
          :key="`complete-message-${_uid}-button-${i}`"
          class="pb-1"
          cols="12"
          sm="10"
          md="9"
          lg="7"
        >
          <v-btn
            :color="button.color"
            class="offline-worksheet-btn"
            :loading="loading"
            :disabled="button.disabled"
            block
            @click.stop="button.action"
          >
            <v-icon v-if="button.iconLeft" class="dashboard-message-btn-icon">
              {{ button.iconLeft }}
            </v-icon>
            {{ button.text }}
            <v-icon v-if="button.iconRight" right>
              {{ button.iconRight }}
            </v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
    <upload-offline-worksheet-dialog v-model="dialog" />

    <!-- <teacher-video-overlay
      v-model="teachersVideoDialog"
      :video="offlineWorksheet ? offlineWorksheet.videoDetail : undefined"
      remove-scroll
    /> -->
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { APP_EVENTS } from '@/models'

import UploadOfflineWorksheetDialog from './UploadOfflineWorksheetDialog.vue'

export default {
  name: 'OfflineWorksheetCard',

  components: {
    UploadOfflineWorksheetDialog
  },

  data: () => {
    return {
      dialog: false,
      teachersVideoDialog: false,
      loading: false,
      testHeight: 0
    }
  },

  computed: {
    ...mapGetters({ children: 'getCurrentChild' }),
    ...mapGetters('admin/curriculum', ['getLesson']),

    offlineWorksheet () {
      if (this.getLesson) {
        return this.getLesson.worksheets.find(({ type }) => type === 'OFFLINE')
      }
      return null
    },

    buttons () {
      return [
        {
          text: this.$vuetify.breakpoint.xsOnly ? 'DOWNLOAD WORKSHEET' : 'DOWNLOAD HANDS-ON WORKSHEET',
          color: 'accent',
          iconLeft: 'pg-icon-download',
          action: () => {
            if (this.offlineWorksheet) {
              window.open(this.offlineWorksheet.pdfUrl, '_blank')
              this.$nuxt.$emit(APP_EVENTS.DASHBOARD_WORKSHEET_DOWNLOAD, this.offlineWorksheet.name)
            }
          }
        },
        {
          text: this.$vuetify.breakpoint.xsOnly ? 'UPLOAD WORKSHEET' : 'UPLOAD COMPLETED WORKSHEET',
          color: '#FEC572',
          iconLeft: 'pg-icon-camera',
          disabled: (this.getLesson && this.getLesson.previewMode),
          action: () => {
            this.dialog = true
          }
        }
      ]
    },

    testWidth () {
      return `${((this.testHeight * 16) / 9)}px`
    }
  },

  watch: {
    offlineWorksheet () {
      this.getDims()
    }
  },

  mounted () {
    this.getDims()
  },

  methods: {
    onPlayerReady (player) {
      const waitAndLoad = window.setInterval(() => {
        if (this.getLesson) {
          player.loadMedia({
            poster: this.offlineWorksheet.videoDetail.image,
            src: {
              src: this.offlineWorksheet.videoDetail.videoUrl.HLS,
              type: 'application/x-mpegURL'
            }
          })
          window.clearInterval(waitAndLoad)
        }
      }, 50)
    },

    showVideo () {
      const playlist = [
        {
          title: '',
          src: {
            url: this.offlineWorksheet.videoDetail.videoUrl.HLS,
            type: 'application/x-mpegURL'
          },
          meta: {
            videoId: this.offlineWorksheet.videoDetail.id
          }
        }
      ]

      this.$nuxt.$emit('open-lesson-teacher-video', {
        playlist, index: 0
      })
    },

    getDims () {
      const el = document.querySelector('.test-height')
      if (el) {
        this.testHeight = el.clientHeight
      }
    }
  }
}
</script>

<style lang="scss">
.ofws {
  &-header {
    position: relative;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: flex-end;
    padding: 12px;
    @media screen and (max-width: 599px) {
      min-height: 370px
    };
  }
  &-content {
    width: 100%;
  }
  &-icon {
    margin: 12px;
    width: 200px;
    @media screen and (min-width: 960px) {
      position: absolute;
      top: calc(50% - 270px);
      left: calc(50% - 80px);
      z-index: 100;
    };
  }
}

.test-height {
  background-color: rgba(127, 127, 127, 0.125);
  height: calc(100% - 206px);
  max-height: calc(100% - 206px);
}

.test-width {
  max-width: var(--max-video-width);
  margin: 0 auto;
}
.offline-worksheet {
  &-image {
    background-image: linear-gradient(to top, rgba(39, 39, 39, 0.9), rgba(255, 255, 255, 0) 80%), var(--offlineWorksheetThumbnailUrl);
    position: center, center;
    background-repeat: no-repeat, no-repeat;
    background-size: cover;
  }
  &-btn.v-btn, &-btn.v-btn.v-btn--disabled {
    height: 59px !important;
    font-size: 20px;
    letter-spacing: 0.04em;
    font-weight: bold;
    line-height: 1.46;
    color: white !important;
    @media screen and (max-width: 599px) {
      font-size: 16px;
    }
  }
}
</style>
