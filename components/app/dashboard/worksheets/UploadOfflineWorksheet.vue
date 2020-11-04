<template>
  <v-overlay :value="value" :z-index="700">
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
            v-for="category in categories"
            :key="`category-${category.id}`"
            v-slot="{ hover }"
          >
            <v-card
              :class="['ma-2 clickable category-card', { scaled: hover }]"
              :elevation="hover ? 12 : 2"
              :disabled="loading"
              @click.stop="openFileDialog(category.id)"
            >
              <v-card-text>
                <div class="d-flex flex-column align-center">
                  <p class="text-h6 my-0">
                    {{ category.category }}
                  </p>

                  <v-img
                    v-if="images[`image_${category.id}`]"
                    class="flex-shrink-1 flex-grow-0"
                    :src="images[`image_${category.id}`]"
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
                  :id="`category-${category.id}-upload`"
                  class="d-none"
                  type="file"
                  accept="image/*"
                  @change="setFile($event, category.id)"
                >
              </v-card-text>
            </v-card>
          </v-hover>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-btn
              class="dashboard-message-btn mt-3"
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
        :z-index="1000"
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

export default {
  name: 'UploadOfflineWorksheet',

  props: {
    value: {
      type: Boolean,
      required: true
    }
  },

  data () {
    return {
      loading: false,
      categories: [],
      images: {}
    }
  },

  computed: {
    ...mapGetters({ currentChild: 'getCurrentChild' }),
    ...mapGetters('admin/curriculum', ['getLesson']),

    offlineWorksheet () {
      if (this.getLesson) {
        return this.getLesson.worksheets.find(({ type }) => type === 'OFFLINE')
      }
      return null
    }
  },

  watch: {
    value (val) {
      if (val) {
        this.reset()
      }
    }
  },

  created () {
    this.getOfflineWorksheetCategories().then((data) => {
      this.categories = data
    })
  },

  methods: {
    ...mapActions('offline-worksheet-categories', [
      'getOfflineWorksheetCategories'
    ]),
    ...mapActions('offline-worksheet', {
      uploadWorksheet: 'upload',
      getUploaded: 'getUploaded'
    }),
    ...mapActions('children/lesson', ['saveWorksheetProgress']),

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

    openFileDialog (categoryId) {
      const uploader = document.getElementById(`category-${categoryId}-upload`)
      uploader.click()
    },

    setFile (e, categoryId) {
      this.loading = true

      this.uploadWorksheet({
        lessonId: this.getLesson.id,
        childrenId: this.currentChild[0].id,
        categoryId,
        File: e.target.files[0]
      })
        .then(({ url }) => {
          this.images[`image_${categoryId}`] = url
          this.$snotify.success('Your worksheet has been uploaded!')
          const date = new Date().toISOString().substr(0, 19)
          return this.saveWorksheetProgress({
            lessonId: this.getLesson.id,
            childId: this.currentChild[0].id,
            worksheet: {
              id: this.offlineWorksheet.id,
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
