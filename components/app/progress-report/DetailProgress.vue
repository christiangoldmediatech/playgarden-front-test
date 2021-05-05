<template>
  <v-container
    fluid
    class=" container"
    :class="{ 'ma-5': !$vuetify.breakpoint.xs }"
  >
    <div v-if="!$vuetify.breakpoint.xs" class="container__image">
      <center class="mt-n12">
        <v-img :src="getIcon" class="ml-4 mt-4" />
        <div class="ml-7">
          <v-progress-linear class="mb-3" :value="(getDataCurrent.value === undefined) ? 0 : getDataCurrent.value" height="15" rounded color="accent" />
          <span class="text-progress">{{ `${(getDataCurrent.value === undefined) ? 0 : getDataCurrent.value}/100` }}</span>
        </div>
      </center>
    </div>
    <v-row v-else no-gutters>
      <v-list-item class="mt-n6">
        <v-list-item-avatar class="mt-n8" size="66">
          <v-img :src="getIcon" />
        </v-list-item-avatar>
        <v-list-item-content class="text-center report-card-type">
          <div class="ml-7">
            <v-progress-linear class="mb-3" :value="(getDataCurrent.value === undefined) ? 0 : getDataCurrent.value" height="15" rounded color="accent" />
            <span class="text-progress">{{ `${(getDataCurrent.value === undefined) ? 0 : getDataCurrent.value}/100` }}</span>
          </div>
        </v-list-item-content>
      </v-list-item>
    </v-row>
    <div class="container__text">
      <underlined-title class="text-h6 text-md-h3" :text="reportCardType" />
      <row class="mb-6 mr-6 mt-8">
        <p class="text-body-1 text-lg-h7 text-xl-h6 text-progress mt-4 pb-10" v-html="dataReportCardType.description" />

        <p class="mt-n8">
          <v-row no-gutters>
            <v-col>
              <span :class="getClassColor">{{ getScale }}</span>
            </v-col>

            <v-col cols="4" class="text-center text-sm-right pt-3">
              <span class="font-weight-bold text-h6 text-md-h4">{{ `${(getDataCurrent.value === undefined) ? 0 : getDataCurrent.value}%` }}</span>
            </v-col>
          </v-row>
        </p>

        <p>
          <underlined-title class="text-h6 text-md-h7 text-xl-h6" text="What is this?" />
        </p>

        <p class="text-body-1 text-lg-h7 text-progress pb-16 pt-8" v-html="getTextWhatIsThis" />
      </row>
    </div>
  </v-container>
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
  padding: 20px 40px 40px !important;
  width: 100%;
  &__image {
    width: 35% !important;
    margin: 30px 30px 30px 0 !important;
    float: left !important;
  }
  &__text {
    display: inline !important;
  }
}
</style>
