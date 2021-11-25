<template>
  <v-overlay :value="value" :z-index="4000">
    <v-card class="upload-dialog-container" light>
      <div class="green-line-bigger green-line-1" />
      <div class="green-line-bigger green-line-2" />

      <v-card-text class="upload-dialog-content">
        <div class="text-center mt-3 mb-2">
          <underlined-title class="text-h3" text="Student Portfolio" />
        </div>

        <div class="text-center mb-6">
          <span>
            Keep track of your worksheets and progress!
          </span>
        </div>
        <v-row class="mx-0" justify="center">
          <v-hover
            v-for="(category, indexCategory) in categoriesWorksheet"
            :key="`${category.category}-${indexCategory}`"
            v-slot="{ hover }"
          >
            <v-card v-if="loadingView">
              <pg-loading />
            </v-card>
            <v-card
              v-else
              :class="['ma-2 clickable category-card', { scaled: hover }]"
              :elevation="hover ? 12 : 2"
              :disabled="loading"
              @click.stop="openFileDialog(category, indexCategory)"
            >
              <v-card-text>
                <div class="d-flex flex-column align-center">
                  <p class="text-h6 my-0">
                    {{ category.category }}
                  </p>

                  <v-img
                    v-if="images[`image_${category.id}_${indexCategory}`]"
                    class="flex-shrink-1 flex-grow-0"
                    :src="images[`image_${category.id}_${indexCategory}`]"
                    max-width="128"
                    height="128"
                    contain
                  />
                  <v-img
                    v-else
                    class="flex-shrink-1 flex-grow-0"
                    :src="category.icon"
                    height="128"
                    contain
                  />

                  <p class="text-h6 my-0">
                    Upload Worksheet
                  </p>
                </div>
                <input
                  :id="`${category.category}-${indexCategory}-upload`"
                  class="d-none"
                  type="file"
                  accept="image/*"
                  @change="setFile($event, category.id, indexCategory, category)"
                >
              </v-card-text>
            </v-card>
          </v-hover>
        </v-row>

        <v-row>
          <v-col class="text-center text-caption grey--text mb-n3">
            * File(s) must be in JPG or PNG format only.
          </v-col>
        </v-row>

        <v-row justify="center">
          <v-btn
            class="dashboard-message-btn mt-5 white--text"
            color="#FEC572"
            :disabled="loading"
            x-large
            @click.stop="goToFirstActivity"
          >
            <v-icon left>
              pg-icon-play
            </v-icon>
            Go to Activities
          </v-btn>

          <v-col cols="12">
            <v-btn
              class="dashboard-message-btn"
              color="primary"
              text
              block
              tile
              :disabled="loading"
              @click.stop="close"
            >
              Return to Dashboard
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>

      <v-overlay
        v-if="loading"
        absolute
        :value="loading"
        :opacity="0.13"
        :z-index="2000"
        :dark="false"
        light
      >
        <v-progress-circular
          color="rgba(248, 152, 56, 1)"
          size="128"
          width="12"
          indeterminate
        />
      </v-overlay>
    </v-card>
  </v-overlay>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { APP_EVENTS } from '@/models'

export default {
  name: 'UploadOfflineWorksheet',

  props: {
    value: {
      type: Boolean,
      required: false
    }
  },

  data () {
    return {
      loading: false,
      loadingView: true,
      lessonCurrent: null,
      worksheetoffline: null,
      categoriesWorksheet: [],
      images: {}
    }
  },

  computed: {
    ...mapGetters({ currentChild: 'getCurrentChild' }),
    ...mapGetters('admin/curriculum', ['getLesson']),

    firstActivity () {
      if (this.getLesson && this.getLesson.lessonsActivities && this.getLesson.lessonsActivities.length) {
        const firstActivity = this.getLesson.lessonsActivities[0]
        return {
          name: 'app-dashboard-lesson-activities',
          query: {
            id: firstActivity.activity.id
          }
        }
      }
      return null
    }
  },

  watch: {
    value (val) {
      if (val) {
        this.reset()
      }
    },
    lessonCurrent (val) {
      if (val) {
        this.worksheetoffline = this.lessonCurrent.worksheets.find(({ type }) => type === 'OFFLINE')
        this.getCategoriesByWorksheetId()
      }
    }
  },

  created () {
    this.lessonCurrent = this.getLesson
  },

  methods: {
    ...mapActions('offline-worksheet-categories', [
      'getCategoriesWorksheetsOfflineAppByWorksheetId',
      'getOfflineWorksheetCategories'
    ]),
    ...mapActions('offline-worksheet', {
      uploadWorksheet: 'upload',
      getUploaded: 'getUploaded'
    }),
    ...mapActions('children/lesson', ['saveWorksheetProgress']),

    goToFirstActivity () {
      this.$router.push(this.firstActivity)
      this.close()
    },

    async getCategoriesByWorksheetId () {
      try {
        this.loadingView = true
        this.categoriesWorksheet = await this.getCategoriesWorksheetsOfflineAppByWorksheetId(this.worksheetoffline.id)
        if (this.categoriesWorksheet.length === 0) {
          this.buildDataCategories()
        }
      } catch (err) {
      } finally {
        this.loadingView = false
      }
    },

    async buildDataCategories () {
      const categories = await this.getOfflineWorksheetCategories()
      this.categoriesWorksheet = categories.map((category) => {
        return { category: category.category, icon: category.icon, id: category.id }
      })
    },

    async getUploadedWorksheets () {
      this.images = {}
      this.loading = true
      const uploads = await this.getUploaded(this.currentChild[0].id)
      uploads.forEach(({ id, worksheetUploads }) => {
        if (worksheetUploads.length) {
          this.images[`image_${id}`] =
            worksheetUploads[worksheetUploads.length - 1].url
        }
      })
      this.loading = false
    },

    reset () {
      this.images = {}
      this.loading = false
    },

    close () {
      this.$emit('input', false)
    },

    openFileDialog (category, index) {
      const uploader = document.getElementById(`${category.category}-${index}-upload`)
      uploader.click()
    },

    setFile (e, categoryId, index, category) {
      this.loading = true

      this.uploadWorksheet({
        lessonId: this.getLesson.id,
        childrenId: this.currentChild[0].id,
        categoryId,
        File: e.target.files[0]
      })
        .then(({ url }) => {
          this.$nuxt.$emit(APP_EVENTS.DASHBOARD_WORKSHEET_UPLOAD, category.category)
          this.images[`image_${categoryId}_${index}`] = url
          this.$snotify.success('Your worksheet has been uploaded!')
          const date = new Date().toISOString().substr(0, 19)
          return this.saveWorksheetProgress({
            lessonId: this.getLesson.id,
            childId: this.currentChild[0].id,
            worksheet: {
              id: this.worksheetoffline.id,
              completed: true,
              date
            }
          })
        })
        .then(() => {
          this.$nuxt.$emit('dashboard-panel-update')
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss">
.upload-dialog {
  &-container {
    margin: 0 16px;
    max-width: 100vw;
    max-height: 90vh;
    overflow: hidden;
  }
  &-content {
    position: relative;
    max-height: calc(90vh - 60px);
    box-shadow: 0 -1px 6px 0 rgba(0, 0, 0, 0.12);
    overflow-x: hidden;
    overflow-y: auto;
  }
}
.category-card {
  transition: transform 250ms;
}

.scaled {
  transform: scale(1.1);
  z-index: 1;
}
</style>
