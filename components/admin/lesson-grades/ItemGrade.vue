<template>
  <v-row justify="center">
    <v-col cols="3" class="mt-8">
      {{ dataGrade.code }} - {{ dataGrade.name }}
    </v-col>
    <v-col
      v-for="(cardType, i) in reportCards"
      :key="`report-cardType-${i}-${entityType}-${dataGrade.code}`"
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
import { mapActions } from 'vuex'
export default {
  name: 'ItemGrade',
  props: {
    dataGrade: {
      type: Object,
      required: true,
      default: () => ({
        code: '',
        name: '',
        grades: []
      })
    },
    typesReportCards: {
      type: Array,
      required: true,
      default: () => ([])
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
      loading: false,
      listReportCards: [],
      reportCards: [],
      gradesList: [],
      id: null
    }
  },
  computed: {},

  async created () {
    this.reportCards = await this.getTypes()
    this.lessonId = this.$route.query.lessonId
    this.listReportCards = this.typesReportCards
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
      entityType: this.entityType,
      lessonId: this.lessonId
    })
    this.gradesList = grades
    this.getReportCardTypes()
  },
  methods: {
    ...mapActions('grades', ['getGrades']),

    ...mapActions('admin/report-card', ['getTypes']),

    getReportCardTypes () {
      this.reportCards = this.listReportCards.map((type) => {
        const grade = this.gradesList.find(
          data => type.id === data.reportCardType.id
        )
        return {
          text: type.name,
          value: type.id,
          id: grade ? grade.id : null,
          reportCardTypeId: type.id,
          points: grade ? grade.points : 0,
          total: grade ? grade.total : 0
        }
      })
      this.dataGrade.grades = this.reportCards
    }
  }
}
</script>
