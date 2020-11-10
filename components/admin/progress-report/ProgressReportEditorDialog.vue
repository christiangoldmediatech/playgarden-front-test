<template>
  <validation-observer ref="obs" v-slot="{ invalid, passes }">
    <v-dialog
      v-model="dialog"
      :fullscreen="$vuetify.breakpoint.xs"
      max-width="800px"
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
            <v-form ref="activityTypeForm" @submit.prevent="passes(save)">
              <validation-provider
                v-slot="{ errors }"
                name="Name"
                rules="required"
              >
                <pg-select
                  v-model="item.entityType"
                  :error-messages="errors"
                  clearable
                  hide-details
                  :items="entityTypeList"
                  label="Tasks to grade"
                  solo
                />
              </validation-provider>
              <br />

              <div
                v-for="(cardType, i) in reportCardTypes"
                :key="`report-cardType-${i}`"
              >
                <label>{{ cardType.text }}</label>
                <validation-provider
                  v-slot="{ errors }"
                  :name="`Points to ${cardType.text}`"
                  rules="required"
                >
                  <pg-text-field
                    v-model="cardType.total"
                    :error-messages="errors"
                    :label="`Points to ${cardType.text}`"
                    solo
                  />
                </validation-provider>
              </div>
            </v-form>
          </v-container>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />

          <v-btn
            class="white--text"
            color="green"
            :disabled="invalid"
            :loading="loading"
            :text="$vuetify.breakpoint.smAndUp"
            @click.stop="passes(save)"
          >
            Save
          </v-btn>

          <v-btn
            class="white--text"
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
import { mapActions, mapGetters } from 'vuex'

function generateItemTemplate () {
  return {
    entityType: null,
    entityId: null,
    lessonId: null,
    grades: []
  }
}

export default {
  name: 'ProgressReportEditorDialog',

  data () {
    return {
      file: null,
      dialog: false,
      loading: false,
      id: null,
      item: generateItemTemplate(),
      entityTypeList: ['Activities', 'Worksheets', 'Videos']
    }
  },

  computed: {
    ...mapGetters('admin/report-card', ['types']),
    title () {
      return this.id === null ? 'New Progress Report' : 'Edit Progress Report'
    },
    reportCardTypes () {
      return this.types.map((type) => {
        return {
          text: type.name,
          value: type.id,
          points: null,
          total: null
        }
      })
    }
  },

  created () {
    this.$nuxt.$on('open-dialog-progress-report', (dataItem) => {
      console.log('data aqui', dataItem)
      this.open(dataItem)
    })
  },

  beforeDestroy () {
    this.$nuxt.$off('open-dialog-progress-report')
    this.player = null
  },

  methods: {
    ...mapActions('grades', ['createGrade', 'updateGrades']),

    ...mapActions('admin/report-card', [
      'getTypes'
    ]),

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
        this.item.grades = this.reportCardTypes
        if (this.id === null) {
          console.log('save--', this.item)
          // await this.createGrade(this.item)
        } else {
          await this.updateGrades({ id: this.id, data: this.item })
        }
        this.close()
      } catch (err) {
      } finally {
        this.loading = false
      }
    },

    resetItem () {
      this.id = null
      this.item = generateItemTemplate()
    },

    loadItem (item) {
      this.id = item.id
      // Handle keys
      Object.keys(item).forEach((key) => {
        if (Object.prototype.hasOwnProperty.call(this.item, key)) {
          this.item[key] = item[key]
        }
      })
    },

    async open (item) {
      this.resetItem()
      await this.getTypes()
      this.item.entityId = item.id
      this.item.entityType = item.entityType
      this.dialog = true
    }
  }
}
</script>
