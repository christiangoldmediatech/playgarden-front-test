<template>
  <v-row class="pt-12 pb-16">
    <v-col cols="3">
      <center>
        <v-img :src="getDataCurrent.icon" />
        <div class="ml-7">
          <v-progress-linear class="mb-3" :value="getDataCurrent.y" height="15" rounded color="accent" />
          <span class="text-progress">{{ `${getDataCurrent.y}/100` }}</span>
        </div>
      </center>
    </v-col>
    <v-col cols="9">
      <div class="pt-4 mb-4 mr-6">
        <underlined-title class="text-h6 text-md-h3" :text="reportCardType" />

        <p class="text-progress mt-4">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry’s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
        </p>

        <p>
          <v-row no-gutters>
            <v-col class="mt-10">
              <span :class="getClassColor">{{ getScale }}</span>
            </v-col>

            <v-col cols="2" class="text-center text-sm-right pt-12">
              <span class="font-weight-bold text-h6 text-md-h5">{{ `${getDataCurrent.y}%` }}</span>
            </v-col>
          </v-row>
        </p>

        <p>
          <underlined-title class="text-h6 text-md-h7" text="What is this?" />
        </p>

        <p class="text-progress pb-16 pt-8">
          {{ getTextWhatIsThis }}
        </p>
      </div>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'DetailProgress',

  components: {},

  props: {
    reportCardType: {
      type: String,
      required: true,
      default: undefined
    },
    report: {
      type: Object,
      required: true,
      default: () => {}
    },
    dataReportCardType: {
      type: Object,
      required: true,
      default: () => {}
    }
  },

  computed: {
    getDataCurrent () {
      const index = this.report.categories.indexOf(this.reportCardType)
      return this.report.dataSerie[index]
    },

    getTextWhatIsThis () {
      let text = ''
      if (this.getDataCurrent.y <= 20) {
        text = this.dataReportCardType.descriptionProgress.progressing
      } else if (this.getDataCurrent.y > 20 && this.getDataCurrent.y <= 80) {
        text = this.dataReportCardType.descriptionProgress.ageAppropiate
      } else {
        text = this.dataReportCardType.descriptionProgress.areaStrenght
      }
      return text
    },

    getScale () {
      let position = ''
      if (this.getDataCurrent.y <= 20) {
        position = 'Progressing'
      } else if (this.getDataCurrent.y > 20 && this.getDataCurrent.y <= 80) {
        position = 'Age Appropiate'
      } else {
        position = 'Area of Strenght'
      }
      return position
    },

    getClassColor () {
      let colorClass = 'font-weight-bold text-h6 text-md-h5'
      if (this.getDataCurrent.y <= 20) {
        colorClass = `progress-title ${colorClass}`
      } else if (this.getDataCurrent.y > 20 && this.getDataCurrent.y <= 80) {
        colorClass = `age-title ${colorClass}`
      } else {
        colorClass = `area-title ${colorClass}`
      }
      return colorClass
    }
  },

  watch: {},

  created () {},

  methods: {}
}
</script>

<style lang="scss" scoped>
.text-progress {
  color: var(--v-black-base) !important;
  text-align: justify;
}

.progress-title {
  color: var(--v-accent-base) !important;
}

.age-title {
  color: #DCE7B5 !important
}

.area-title {
  color: var(--v-primary-base) !important;
}

.progress-subtitle {
  color: var(--v-primary-base) !important;
}
</style>
