<template>
  <div class="dashboard-panel-container">
    <v-card class="dashboard-panel-card" height="100%">
      <div class="dashboard-panel-card-border-top" />

      <pg-circle-letter-day :day="lesson ? lesson.day : null" :letter="lesson ? lesson.curriculumType.letter : null" />

      <div class="dashboard-panel-content pa-3">
        <content-section
          number="1"
          title="Video Lessons"
          :progress="videos.progress"
          :progress-next="videos.progressNext"
          enabled
        >
          <content-list :items="videos.items" />
        </content-section>

        <content-section
          number="2"
          title="Worksheets"
          :progress="worksheets.progress"
          :progress-next="worksheets.progressNext"
          :enabled="videos.progress === 100"
        >
          <template v-slot:title-append>
            <v-img
              :class="['ml-2', { 'dashboard-panel-disabled': videos.progress < 100 }]"
              :src="require('@/assets/png/dashboard/worksheets.png')"
              max-width="32px"
              max-height="32px"
              contain
            />
          </template>
          <v-list class="py-0" dense>
            <v-list-item
              v-if="worksheets.ONLINE.length"
              class="dashboard-item"
              active-class="dashboard-item-active"
              exact-active-class="dashboard-item-exact"
              :disabled="videos.progress < 100"
              nuxt
              exact
              :to="generateNuxtRoute('online-worksheet')"
            >
              <v-list-item-content>
                <v-list-item-title :class="['dashboard-panel-worksheet-text', { 'dashboard-item-disabled': videos.progress < 100 }]">
                  ONLINE WORKSHEET
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              v-if="worksheets.OFFLINE"
              class="dashboard-item"
              active-class="dashboard-item-active"
              exact-active-class="dashboard-item-exact"
              :disabled="videos.progress < 100"
              nuxt
              exact
              :to="generateNuxtRoute('offline-worksheet')"
            >
              <v-list-item-content>
                <v-list-item-title :class="['dashboard-panel-worksheet-text', { 'dashboard-item-disabled': videos.progress < 100 }]">
                  HANDS-ON LEARNING
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item
              v-if="worksheets.OFFLINE"
              class="dashboard-item"
              :disabled="videos.progress < 100"
            >
              <v-list-item-content>
                <v-btn
                  id="download-worksheet-btn"
                  class="dashboard-panel-worksheet-btn white--text"
                  color="#dce7b5"
                  :disabled="videos.progress < 100"
                  block
                  @click.stop="openPdf"
                >
                  <v-icon color="white" left>
                    pg-icon-download
                  </v-icon>
                  <!-- <pg-icon /> -->
                  DOWNLOAD WORKSHEET
                </v-btn>

                <v-btn
                  v-if="!displayMode"
                  id="upload-worksheet-btn"
                  class="dashboard-panel-worksheet-btn white--text mt-2"
                  color="primary"
                  :disabled="videos.progress < 100"
                  block
                  @click.stop="uploadDialog = true"
                >
                  <v-icon color="white" left>
                    pg-icon-camera
                  </v-icon>
                  <!-- <pg-icon /> -->
                  UPLOAD WORKSHEET
                </v-btn>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </content-section>

        <content-section
          number="3"
          title="Activities"
          :progress="activities.progress"
          :progress-next="activities.progressNext"
          :enabled="videos.progress === 100"
        >
          <content-list :items="activities.items" />
        </content-section>
      </div>
      </pgcircleletterday>
    </v-card>
    <upload-offline-worksheet v-if="!displayMode" v-model="uploadDialog" />
  </div>
</template>

<script>
import DashboardMixin from '@/mixins/DashboardMixin'
// import PgCircleLetterDay from '@/components/pg/components/PgCircleLetterDay'
import UploadOfflineWorksheet from './worksheets/UploadOfflineWorksheet'
import ContentSection from './ContentSection.vue'
import ContentList from './ContentList.vue'

export default {
  name: 'DashboardPanel',

  components: {
    // PgCircleLetterDay,
    UploadOfflineWorksheet,
    ContentSection,
    ContentList
  },

  mixins: [DashboardMixin],

  props: {
    lesson: {
      required: false,
      validator: (val) => {
        return val === null || typeof val === 'object'
      },
      default: null
    },

    displayMode: {
      type: Boolean,
      required: false,
      default: false
    },

    customOverrides: {
      type: Object,
      required: false,
      default: () => {}
    }
  },

  data: () => {
    return {
      uploadDialog: false
    }
  },

  computed: {
    offlineWorksheet () {
      if (this.lesson) {
        return this.lesson.worksheets.find(({ type }) => type === 'OFFLINE')
      }
      return null
    }
  },

  methods: {
    openPdf () {
      if (this.offlineWorksheet) {
        window.open(this.offlineWorksheet.pdfUrl, '_blank')
      }
    }
  }
}
</script>

<style lang="scss">
.dashboard-panel {
  &-container {
    height: 100%;
    padding-top: 70px;
    max-width: 471px;
  }

  &-card {
    padding-top: 87px;
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16) !important;
    &-border-top {
      width: 100%;
      height: 18px;
      position: absolute;
      top: 0;
      background-color: var(--v-primary-base);
      border-radius: 5px;
    }
  }

  &-content {
    height: 100%;
    max-height: 100%;
    overflow-y: auto;
  }

  &-worksheet {
    &-text {
      font-size: 16px !important;
      font-weight: bold !important;
      letter-spacing: 0.1em !important;
    }
    &-btn {
      height: 36px;
    }
  }

  &-disabled {
    -webkit-filter: opacity(40%); /* Chrome, Safari, Opera */
    filter: opacity(40%);
  }
}

#download-worksheet-btn.v-btn--disabled, #download-worksheet-btn.v-btn--disabled i.v-icon, #upload-worksheet-btn.v-btn--disabled, #upload-worksheet-btn.v-btn--disabled i.v-icon {
  color: white !important;
  font-size: 18px !important;
  font-weight: bold !important;
  letter-spacing: 0.04em !important;
}
</style>
