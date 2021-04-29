<template>
  <v-row class="pb-16">
    <div class="container">
      <div v-if="!$vuetify.breakpoint.xs" class="container__image pt-10">
        <center>
          <v-img :src="getIcon" class="ml-4 mt-4" />
          <div class="ml-7">
            <v-progress-linear class="mb-3" :value="(getDataCurrent.value === undefined) ? 0 : getDataCurrent.value" height="15" rounded color="accent" />
            <span class="text-progress">{{ `${(getDataCurrent.value === undefined) ? 0 : getDataCurrent.value}/100` }}</span>
          </div>
        </center>
      </div>
      <div class="container__text">
        <underlined-title class="text-h6 text-md-h3" :text="reportCardType" />
        <div class="mb-6 mr-6 mt-8">
          <p class="text-body-1 text-lg-h7 text-xl-h6 text-progress mt-4 pb-10" v-html="dataReportCardType.description" />

          <p>
            <v-row no-gutters>
              <v-col>
                <span :class="getClassColor">{{ getScale }}</span>
              </v-col>

              <v-col cols="2" class="text-center text-sm-right pt-3">
                <span class="font-weight-bold text-h6 text-md-h4">{{ `${(getDataCurrent.value === undefined) ? 0 : getDataCurrent.value}%` }}</span>
              </v-col>
            </v-row>
          </p>

          <p>
            <underlined-title class="text-h6 text-md-h7 text-xl-h6" text="What is this?" />
          </p>

          <p class="text-body-1 text-lg-h7 text-progress pb-16 pt-8" v-html="getTextWhatIsThis" />
        </div>
      </div>
    </div>
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

    getIcon () {
      return this.getDataCurrent.symbol.replace('image://', '')
    },

    getTextWhatIsThis () {
      let text = ''
      if (this.getDataCurrent.value <= 20) {
        text = this.dataReportCardType.descriptionProgress.progressing
      } else if (this.getDataCurrent.value > 20 && this.getDataCurrent.value <= 80) {
        text = this.dataReportCardType.descriptionProgress.ageAppropiate
      } else {
        text = this.dataReportCardType.descriptionProgress.areaStrenght
      }
      return text
    },

    getScale () {
      let position = ''
      if (this.getDataCurrent.value <= 20) {
        position = 'Progressing'
      } else if (this.getDataCurrent.value > 20 && this.getDataCurrent.value <= 80) {
        position = 'Age Appropriate'
      } else {
        position = 'Area of Strength'
      }
      return position
    },

    getClassColor () {
      let colorClass = 'font-weight-bold text-h6 text-md-h5'
      if (this.getDataCurrent.value <= 20) {
        colorClass = `progress-title ${colorClass}`
      } else if (this.getDataCurrent.value > 20 && this.getDataCurrent.value <= 80) {
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
  text-align: justify !important;
  font-family: Poppins !important;
  font-style: normal !important;
  font-weight: normal !important;
  line-height: 28px !important;
  text-transform: none !important;
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

.container {
  padding: 20px 40px 40px;
  width: 100%;
  &__image {
    width: 35%;
    margin: 30px 30px 30px 0;
    float: left;
  }
  &__text {
    display: inline;
  }
}
</style>
