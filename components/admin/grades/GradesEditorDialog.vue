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
                  disabled
                  label="Tasks to grade"
                  solo-labeled
                />
              </validation-provider>
              <br>

              <div
                v-for="(cardType, i) in reportCardTypes"
                :key="`report-cardType-${i}`"
              >
                <label>{{ cardType.text }}</label>
                <validation-provider
                  v-slot="{ errors }"
                  :name="`Total points to ${cardType.text}`"
                  rules="required"
                >
                  <pg-text-field
                    v-model="cardType.total"
                    :error-messages="errors"
                    :label="`Points to ${cardType.text}`"
                    solo-labeled
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
  name: 'GradesEditorDialog',

  data () {
    return {
      file: null,
      dialog: false,
      loading: false,
      reportCards: [],
      id: null,
      gradesList: [],
      item: generateItemTemplate(),
      entityTypeList: ['Activities', 'Worksheets', 'Videos', 'Meetings']
    }
  },

  computed: {
    ...mapGetters('admin/report-card', ['types']),
    title () {
      return this.id === null
        ? 'Config Progress Report'
        : 'Config Progress Report'
    },
    reportCardTypes () {
      return this.reportCards.map((type) => {
        const grade = this.gradesList.find(
          data => type.id === data.reportCardType.id
        )
        return {
          text: type.name,
          value: type.id,
          id: grade ? grade.id : null,
          reportCardTypeId: type.id,
          points: grade ? grade.points : 0,
          total: grade ? grade.total : null
        }
      })
    }
  },

  created () {
    this.$nuxt.$on('open-dialog-progress-report', (dataItem) => {
      this.open(dataItem)
    })
  },

  beforeDestroy () {
    this.$nuxt.$off('open-dialog-progress-report')
    this.player = null
  },

  methods: {
    ...mapActions('grades', ['createGrade', 'updateGrades', 'getGrades']),

    ...mapActions('admin/report-card', ['getTypes']),

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
          await this.createGrade(this.item)
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
      Object.keys(item).forEach((key) => {
        if (Object.prototype.hasOwnProperty.call(this.item, key)) {
          this.item[key] = item[key]
        }
      })
    },

    async open (item) {
      this.resetItem()
      this.reportCards = await this.getTypes()
      const { grades } = await this.getGrades({
        entityId: item.id,
        entityType: item.entityType
      })
      this.gradesList = grades
      this.item.entityId = item.id
      this.item.entityType = item.entityType
      this.item.lessonId = item.lessonId
      this.dialog = true
    }
  }
}
</script>
