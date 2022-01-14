<template>
  <validation-observer ref="obs" v-slot="{ invalid, passes }">
    <v-dialog
      v-model="dialog"
      :fullscreen="$vuetify.breakpoint.xs"
      max-width="500px"
      persistent
      scrollable
    >
      <v-card>
        <v-toolbar class="flex-grow-0" color="primary darken-1" dark dense flat>
          <v-toolbar-title class="white--text">
            {{ title }}
          </v-toolbar-title>

          <v-spacer />

          <v-btn :disabled="loading" icon @click.stop="close">
            <v-icon>
              mdi-close
            </v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text>
          <v-container>
            <v-form @submit.prevent="passes(save)">
              <validation-provider
                v-slot="{ errors }"
                name="Question"
                rules="required"
              >
                <pg-text-field
                  v-model="item.question"
                  :error-messages="errors"
                  label="Question"
                  solo-labeled
                />
              </validation-provider>

              <validation-provider
                v-slot="{ errors }"
                name="Answer"
                rules="required"
              >
                <pg-tiptap-field
                  v-model="item.answer"
                  :disabled="loading"
                  :error-messages="errors"
                />
              </validation-provider>

              <validation-provider
                v-slot="{ errors }"
                name="Category"
                rules="required"
              >
                <pg-select
                  v-model="item.faqsCategoryId"
                  clearable
                  :disabled="loading"
                  :error-messages="errors"
                  :items="categories"
                  item-text="name"
                  item-value="id"
                  label="Category"
                  solo-labeled
                />
              </validation-provider>
            </v-form>
          </v-container>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />

          <v-btn
            color="green"
            :disabled="invalid"
            :loading="loading"
            :text="$vuetify.breakpoint.smAndUp"
            @click.stop="passes(save)"
          >
            Save
          </v-btn>

          <v-btn
            color="red"
            :disabled="loading"
            :text="$vuetify.breakpoint.smAndUp"
            @click.stop="close"
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </validation-observer>
</template>

<script>
import { mapActions } from 'vuex'

import submittable from '@/utils/mixins/submittable'

function generateItemTemplate () {
  return {
    question: null,
    answer: null,
    faqsCategoryId: null,
    name: null
  }
}

export default {
  name: 'FaqsEditorDialog',

  mixins: [submittable],

  data () {
    return {
      categories: [],
      dialog: false,
      loading: false,
      id: null,
      item: generateItemTemplate()
    }
  },

  computed: {
    title () {
      return this.id === null ? 'New FAQ' : 'Edit FAQ'
    }
  },

  async created () {
    try {
      this.categories = await this.getFAQsCategories()
    } catch (e) {
    } finally {
      this.loading = false
    }
  },

  methods: {
    ...mapActions('faqs', ['createFAQs', 'updateFAQs']),

    ...mapActions('faqs-categories', ['getFAQsCategories']),

    close () {
      this.$nextTick(() => {
        this.dialog = false
        this.loading = false
        this.$refs.obs.reset()
      })
    },

    async save () {
      this.loading = true

      try {
        if (this.id === null) {
          await this.createFAQs(this.item)
        } else {
          await this.updateFAQs({ id: this.id, data: this.item })
        }

        this.$emit('saved')
        this.close()
      } catch (err) {
      } finally {
        this.loading = false
      }
    },

    resetItem () {
      this.id = null
      this.item = generateItemTemplate()
      this.file = null
    },

    loadItem (item) {
      this.id = item.id

      // Handle keys
      Object.keys(item).forEach((key) => {
        if (Object.prototype.hasOwnProperty.call(this.item, key)) {
          this.item[key] = item[key]
        }
      })

      if (item.faqsCategory) {
        this.item.faqsCategoryId = item.faqsCategory.id
      }
    },

    open (evt, item = null) {
      this.resetItem()

      if (item) {
        this.loadItem(item)
      }

      this.$nextTick(() => {
        this.dialog = true
      })
    }
  }
}
</script>
