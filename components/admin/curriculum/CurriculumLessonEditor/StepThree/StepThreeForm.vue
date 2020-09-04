<template>
  <validation-observer v-slot="{ invalid, passes, reset }">
    <p class="primary--text text-h5">
      {{ editing ? "Editing" : "New" }} online worksheet
    </p>

    <v-form @submit.prevent="passes(onSubmit)">
      <!-- Matching type -->
      <validation-provider name="Matching type" rules="required">
        <v-row class="mb-6">
          <v-col
            v-for="(type, indexMT) in matchingTypes"
            :key="indexMT"
            cols="6"
          >
            <v-btn
              block
              :color="
                matchingDraft.type === type.value ? 'primary' : 'grey lighten-5'
              "
              :disabled="loading"
              @click="matchingDraft.type = type.value"
            >
              {{ type.label }}
            </v-btn>
          </v-col>
        </v-row>

        <input v-model="matchingDraft.type" type="hidden">
      </validation-provider>

      <!-- Worksheet name -->
      <validation-provider v-slot="{ errors }" name="Name" rules="required">
        <v-text-field
          v-model="fakeName"
          clearable
          :disabled="loading"
          :error-messages="errors"
          label="Name"
          :loading="loading"
          solo
        />
      </validation-provider>

      <!-- Description -->
      <validation-provider
        v-slot="{ errors }"
        name="Description"
        rules="required"
      >
        <v-textarea
          v-model="fakeDescription"
          clearable
          :disabled="loading"
          :error-messages="errors"
          label="Description"
          :loading="loading"
          solo
        />
      </validation-provider>

      <p
        v-show="matchingDraft.type === 'TAP_CORRECT'"
        v-cloak
        class="primary--text text-center"
      >
        First image is always the correct
      </p>

      <v-row class="mb-6">
        <v-col
          v-for="(item, indexMT) in matchingDraft.images"
          :key="indexMT"
          cols="6"
          lg="3"
        >
          <!-- Matching word -->
          <validation-provider
            v-slot="{ errors }"
            :name="`Word ${indexMT + 1}`"
            rules="required"
          >
            <v-text-field
              v-model="item.word"
              clearable
              :disabled="loading"
              :error-messages="errors"
              :label="`Word ${indexMT + 1}`"
              :loading="loading"
              solo
            />
          </validation-provider>

          <!-- Matching image -->
          <template v-if="item.image">
            <div class="mb-6 mt-3">
              <v-badge avatar class="image-badge" color="error" overlap>
                <template v-slot:badge>
                  <v-avatar class="clickable" @click.native="item.image = null">
                    <v-icon>
                      mdi-close
                    </v-icon>
                  </v-avatar>
                </template>

                <v-img max-width="100%" :src="item.image" />
              </v-badge>
            </div>
          </template>

          <validation-provider
            v-else
            v-slot="{ errors }"
            :name="`Image ${indexMT + 1}`"
            rules="required|size:10000"
          >
            <file-uploader
              :ref="`fileUploader${indexMT}`"
              v-model="item.file"
              :error-messages="errors"
              :label="`Image ${indexMT + 1}`"
              mode="image"
              path="lesson"
              :placeholder="`Select image ${indexMT + 1}`"
              prepend-icon="mdi-camera"
              solo
              jpg
              png
              svg
            />
          </validation-provider>
        </v-col>
      </v-row>

      <v-row class="mb-6" justify="center">
        <v-btn
          class="ma-3"
          color="primary"
          :loading="loading"
          text
          x-large
          @click="onCancel(reset)"
        >
          CANCEL
        </v-btn>

        <v-btn
          class="ma-3"
          color="primary"
          :disabled="invalid"
          :loading="loading"
          type="submit"
          x-large
        >
          SAVE
        </v-btn>
      </v-row>
    </v-form>
  </validation-observer>
</template>

<script>
import { mapActions } from 'vuex'

import submittable from '@/utils/mixins/submittable'

export default {
  name: 'StepThreeForm',

  mixins: [submittable],

  props: {
    lessonId: {
      type: [Number, String],
      required: false,
      default: null
    },

    resource: {
      type: Object,
      required: false,
      default: () => {}
    }
  },

  data: () => ({
    matchingDraft: {},
    matchingTypes: [
      { label: 'CONNECTING PAIRS', value: 'CONNECTING_PAIRS' },
      { label: 'TAP CORRECT', value: 'TAP_CORRECT' }
    ],

    loading: false
  }),

  computed: {
    editing () {
      return Boolean(this.resource.id)
    },

    fakeName: {
      get () {
        return this.draft.name
      },
      set (v) {
        this.draft.name = v
        this.matchingDraft.name = v
      }
    },

    fakeDescription: {
      get () {
        return this.draft.description
      },
      set (v) {
        this.draft.description = v
        this.matchingDraft.question = v
      }
    }
  },

  methods: {
    ...mapActions('admin/curriculum/worksheet', [
      'createWorksheetByLessonId',
      'updateWorksheetByLessonId'
    ]),

    ...mapActions('admin/matching-images', [
      'createMatchingImage',
      'getMatchingImageById',
      'updateMatchingImage'
    ]),

    async getMatchingDraft () {
      try {
        const data = await this.getMatchingImageById(this.resource.worksheetId)

        return {
          ...data,
          images: data.images.map(i => ({ ...i, file: null }))
        }
      } catch (e) {
        return {
          name: null,
          images: [
            { file: null, image: null, word: null },
            { file: null, image: null, word: null },
            { file: null, image: null, word: null },
            { file: null, image: null, word: null }
          ],
          question: null,
          type: null
        }
      }
    },

    async onSubmit () {
      this.loading = true

      const { id } = await this.processMatchingDraft()
      try {
        this.draft.worksheetId = id

        const data = await this.submitMethod(this.getSubmittableData())

        this.$emit('click:submit', data)
      } catch (e) {
      } finally {
        this.loading = false
      }
    },

    async processMatchingDraft () {
      this.matchingDraft.images = await Promise.all(
        this.matchingDraft.images.map(async (item, index) => {
          if (item.file) {
            item.image = await this.$refs[
              `fileUploader${index}`
            ][0].handleUpload()
          }

          return item
        })
      )

      return await this.submitMatchingMethod(this.matchingDraft)
    },

    async resetDraft () {
      this.draft = this.editing
        ? this.$jsonCopy(this.resource)
        : {
          name: null,
          description: null,
          type: 'ONLINE',
          worksheetId: null
        }

      this.matchingDraft = this.editing
        ? await this.getMatchingDraft()
        : {
          name: null,
          images: [
            { file: null, image: null, word: null },
            { file: null, image: null, word: null },
            { file: null, image: null, word: null },
            { file: null, image: null, word: null }
          ],
          question: null,
          type: null
        }
    },

    submitMethod (data) {
      return this.editing
        ? this.updateWorksheetByLessonId({
          id: this.resource.id,
          lessonId: this.lessonId,
          data
        })
        : this.createWorksheetByLessonId({ lessonId: this.lessonId, data })
    },

    submitMatchingMethod (data) {
      return this.editing
        ? this.updateMatchingImage({
          id: this.resource.worksheetId,
          data
        })
        : this.createMatchingImage(data)
    }
  }
}
</script>

<style lang="scss" scoped>
.image-badge {
  width: 100%;
}
</style>
