<template>
  <v-dialog
    :value="value"
    persistent
    @input="$emit('input', $event)"
  >
    <v-card>
      <div class="green-line green-line-1" />
      <div class="green-line green-line-2" />

      <v-card-text>
        <div class="text-center">
          <underlined-title
            class="text-h4"
            text="Student Portfolio"
          />
        </div>

        <div class="text-center mb-4">
          <span>
            Keep track of your worksheets and progress!
          </span>
        </div>

        <v-row justify="center">
          <v-hover
            v-for="category in categories"
            :key="`category-${category.id}`"
            v-slot="{ hover }"
          >
            <v-card
              :class="['ma-2 clickable category-card', { 'scaled': hover }]"
              :elevation="(hover) ? 12 : 2"
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
                  <v-icon
                    v-else
                    size="128"
                    v-text="'mdi-image-outline'"
                  />
                  <p class="text-h6 my-0">
                    Upload Worksheet
                  </p>
                </div>
                <input :id="`category-${category.id}-upload`" class="d-none" type="file" accept="image/*" @change="setFile($event, category.id)">
              </v-card-text>
            </v-card>
          </v-hover>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn
          text
          :disabled="loading"
          @click.stop="close"
        >
          Close
        </v-btn>
        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-dialog>
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
    ...mapGetters('admin/curriculum', ['getLesson'])
  },

  watch: {
    value (val) {
      if (val) {
        this.reset()
      }
    }
  },

  created () {
    this.getOfflineWorksheetCategories().then((data) => { this.categories = data })
  },

  methods: {
    ...mapActions('offline-worksheet-categories', ['getOfflineWorksheetCategories']),
    ...mapActions('offline-worksheet', { uploadWorksheet: 'upload', getUploaded: 'getUploaded' }),

    async getUploadedWorksheets () {
      this.images = {}
      this.loading = true
      const uploads = await this.getUploaded(this.currentChild[0].id)
      uploads.forEach(({ id, worksheetUploads }) => {
        if (worksheetUploads.length) {
          this.images[`image_${id}`] = worksheetUploads[worksheetUploads.length - 1].url
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
          // this.close()
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.category-card {
  transition: transform 250ms;
}

.scaled {
  transform: scale(1.10);
  z-index: 1;
}
</style>
