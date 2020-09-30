<template>
  <v-card class="d-flex flex-column dashboard-content-card" height="100%">
    <div v-if="offlineWorksheet && offlineWorksheet.videoDetail">
      <pg-inline-video-player />
    </div>
    <div
      v-else
      class="d-flex flex-column justify-end align-center offline-worksheet-image flex-grow-1 flex-shrink-0 dashboard-message-padding"
      :style="{ '--offlineWorksheetThumbnailUrl': `url(${require('@/assets/jpg/worksheets_completed_1.jpg')})` }"
    >
      <underlined-title
        class="white--text"
        font-size="56px"
        font-weight="bold"
        text="Hands-on Learning"
      />
      <p class="white--text text-center">
        Hands-on learning is a crucial part of the educational experience. Learning through doing strengthens the cognitive connections and builds a strong foundation for knowledge.
      </p>
    </div>
    <v-container>
      <v-row class="flex-column" align="center">
        <h5 class="text-h5 font-weight-bold">
          What do you want to do next?
        </h5>

        <v-col
          v-for="(button, i) in buttons"
          :key="`complete-message-${_uid}-button-${i}`"
          class="pb-1"
          cols="12"
          sm="10"
          md="8"
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
    <upload-offline-worksheet v-model="dialog" />
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'OfflineWorksheetCard',

  data: () => {
    return {
      dialog: false,
      loading: false
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
          text: 'DOWNLOAD HANDS-ON WORKSHEET',
          color: 'accent',
          iconLeft: 'pg-icon-download',
          action: () => {
            if (this.offlineWorksheet) {
              window.open(this.offlineWorksheet.pdfUrl, '_blank')
            }
          }
        },
        {
          text: 'UPLOAD HANDS-ON WORKSHEET',
          color: '#FEC572',
          iconLeft: 'pg-icon-camera',
          disabled: (this.getLesson && this.getLesson.previewMode),
          action: () => {
            this.dialog = true
          }
        }
      ]
    }
  }
}
</script>

<style lang="scss">
.offline-worksheet {
  &-image {
    background-image: linear-gradient(to top, rgba(39, 39, 39, 0.9), rgba(255, 255, 255, 0) 80%), var(--offlineWorksheetThumbnailUrl);
    position: center, center;
    background-repeat: no-repeat, no-repeat;
    background-size: cover;
  }
  &-btn.v-btn {
    height: 59px !important;
    font-size: 20px;
    letter-spacing: 0.04em;
    font-weight: bold;
    line-height: 1.46;
    color: white !important;
  }
}
</style>
