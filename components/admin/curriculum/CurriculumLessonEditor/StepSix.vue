<template>
  <validation-observer v-slot="{ invalid, passes }">
    <p class="primary--text text-h5">
      Worksheets
    </p>

    <v-form @submit.prevent="passes(onSubmit)">
      <!-- Ending text -->
      <tiptap-field
        v-model="draft.ending"
        :disabled="loading"
        label="Ending text"
        output-format="json"
      />

      <!-- Learning -->
      <tiptap-field
        v-model="draft.learning"
        :disabled="loading"
        label="Learning"
        output-format="json"
      />

      <v-btn
        block
        class="mb-6"
        color="primary"
        :disabled="invalid"
        :loading="loading"
        type="submit"
        x-large
      >
        FINALIZE
      </v-btn>

      <v-btn
        block
        class="mb-6"
        color="primary"
        :loading="loading"
        text
        :to="{
          name: 'admin-curriculum-management-editor',
          query: {
            step: 5,
            lessonId
          }
        }"
        x-large
      >
        BACK
      </v-btn>
    </v-form>
  </validation-observer>
</template>

<script>
import { mapActions } from 'vuex'

import submittable from '@/utils/mixins/submittable'

export default {
  name: 'StepSix',

  mixins: [submittable],

  props: {
    lessonId: {
      type: [Number, String],
      required: false,
      default: null
    }
  },

  data: () => ({
    loading: false
  }),

  created () {
    if (this.lessonId) {
      this.loading = true

      this.getLessonById(this.lessonId).then((data) => {
        this.draft = data
        this.loading = false
      })
    }
  },

  methods: {
    ...mapActions('admin/curriculum/ending', ['updateEndingByLessonId']),

    ...mapActions('admin/curriculum', ['getLessonById']),

    async onSubmit () {
      this.loading = true

      try {
        const data = await this.updateEndingByLessonId({
          lessonId: this.lessonId,
          data: this.getSubmittableData()
        })

        this.$emit('click:submit', data)
      } catch (e) {
      } finally {
        this.loading = false
      }
    },

    resetDraft () {
      this.draft = {
        ending: {},
        learning: {}
      }
    }
  }
}
</script>
