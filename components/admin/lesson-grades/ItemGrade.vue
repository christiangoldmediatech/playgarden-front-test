<template>
  <v-row justify="center">
    <v-col cols="3" class="mt-8">
      {{ dataGrade.code }} - {{ dataGrade.name }}
    </v-col>
    <v-col
      v-for="(cardType, i) in dataGrade.grades"
      :key="`report-cardType-${i}`"
    >
      <label>{{ cardType.text }}</label>
      <validation-provider
        v-slot="{ errors }"
        :name="`Total points to ${cardType.text}`"
        rules="required"
      >
        <pg-text-field
          v-model="cardType.points"
          :error-messages="errors"
          label="Points"
          solo-labeled
        />
      </validation-provider>
    </v-col>
    <v-col cols="12">
      <v-divider></v-divider>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'ItemGrade',

  props: {
    dataGrade: {
      type: Object,
      required: true,
      default: () => ({})
    },
    entityType: {
      type: String,
      required: true,
      default: ''
    }
  },

  data () {
    return {
      entityId: null,
      dialog: false,
      loading: false,
      gradesList: [],
      grades: [],
      item: {
        code: '',
        name: '',
        grades: []
      },
      id: null,
      entityTypeList: ['Activities', 'Worksheets', 'Videos', 'LiveSessions']
    }
  },

  computed: {
    ...mapGetters('admin/report-card', ['types']),
    reportCardTypes () {
      return this.types.map((type) => {
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

  async created () {
    this.dataGrade.grades = this.reportCardTypes

    if (this.entityType === 'Activities') {
      this.entityId = this.dataGrade.activity.id
    }

    if (this.entityType === 'Videos') {
      this.entityId = this.dataGrade.id
    }

    if (this.entityType === 'Worksheets') {
      this.entityId = this.dataGrade.worksheetId
    }

    const { grades } = await this.getGrades({
      entityId: this.entityId,
      entityType: this.entityType
    })
    this.gradesList = grades
  },

  methods: {
    ...mapActions('grades', ['getGrades'])
  }
}
</script>
