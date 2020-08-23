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
          <span class="text-h4 title-text">
            Student Portfolio
          </span>
        </div>

        <div class="text-center mb-4">
          <span>
            Keep track of your worksheets and progress!
          </span>
        </div>

        <div class="text-center">
          <span>
            Who is uploading?
          </span>
          <v-row no-gutters justify="center">
            <v-col
              cols="12"
              sm="8"
              md="6"
              lg="3"
              xl="2"
            >
              <v-select
                v-model="selectedChild"
                :items="childrenList"
                placeholder="Select a child"
                solo
              >
                <template v-slot:selection="{ item }">
                  <v-list-item>
                    <v-list-item-avatar>
                      <v-img :src="item.backpack.image" />
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title>
                        {{ item.firstName }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </template>

                <template v-slot:item="{ item, on, attrs }">
                  <v-list-item
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-list-item-avatar>
                      <v-img :src="item.backpack.image" />
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title>
                        {{ item.firstName }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </template>
              </v-select>
            </v-col>
          </v-row>
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
              :disabled="disabled"
              @click.stop="openFileDialog(category.id)"
            >
              <v-card-text>
                <v-row no-gutters justify="center">
                  <v-col class="text-center" cols="12">
                    <p class="text-h6 my-0">
                      {{ category.category }}
                    </p>
                    <v-icon
                      size="128"
                      v-text="'mdi-image-outline'"
                    />
                    <p class="text-h6 my-0">
                      Upload Worksheet
                    </p>
                  </v-col>
                </v-row>
                <input :id="`category-${category.id}-upload`" class="d-none" type="file" @change="setFile($event, category.id)">
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
      selectedChild: null
    }
  },

  computed: {
    ...mapGetters('children', { children: 'rows' }),
    ...mapGetters('admin/curriculum', ['getLesson']),

    disabled () {
      return (this.selectedChild === null || this.loading)
    },

    childrenList () {
      return this.children.map((child) => {
        return {
          value: child.id,
          text: child.firstName,
          ...child
        }
      })
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
    this.getChildren()
    this.getOfflineWorksheetCategories().then((data) => { this.categories = data })
  },

  methods: {
    ...mapActions('offline-worksheet-categories', ['getOfflineWorksheetCategories']),
    ...mapActions('offline-worksheet', { uploadWorksheet: 'upload' }),
    ...mapActions('children', { getChildren: 'get' }),

    reset () {
      this.loading = false
      this.selectedChild = null
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
        childrenId: this.selectedChild,
        categoryId,
        File: e.target.files[0]
      })
        .then(() => {
          this.$snotify.success('Your worksheet has been uploaded!')
          this.close()
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
