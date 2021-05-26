<template>
  <v-container fluid class="detail-progress-wrapper">
    <!-- Image and Score: Desktop -->
    <div v-if="$vuetify.breakpoint.mdAndUp" class="detail-progress-image mr-8 mb-2">
      <img :src="getIcon">
      <div class="text-center">
        <v-progress-linear
          class="pb-3"
          height="15"
          rounded
          color="accent"
          :value="(getDataCurrent.value === undefined) ? 0 : getDataCurrent.value"
        />
        <span class="progress-text">
          {{ `${(getDataCurrent.value === undefined) ? 0 : getDataCurrent.value}/100` }}
        </span>
      </div>
    </div>
    <!-- Image and Score: Mobile -->
    <v-row v-else no-gutters class="py-6">
      <v-list-item>
        <v-list-item-avatar size="66">
          <v-img :src="getIcon" />
        </v-list-item-avatar>
        <v-list-item-content>
          <div class="text-center">
            <v-progress-linear
              class="pb-3"
              height="15"
              rounded
              color="accent"
              :value="(getDataCurrent.value === undefined) ? 0 : getDataCurrent.value"
            />
            <span class="progress-text">
              {{ `${(getDataCurrent.value === undefined) ? 0 : getDataCurrent.value}/100` }}
            </span>
          </div>
        </v-list-item-content>
      </v-list-item>
    </v-row>

    <!-- Details Text -->
    <div class="text-left pb-4">
      <underlined-title class="text-h4 text-md-h3" :text="reportCardType" />
    </div>
    <p class="text-body-1 text-lg-h7 text-xl-h6 progress-text text-justify" v-html="dataReportCardType.description" />

    <!-- Progress value -->
    <v-row no-gutters class="py-4">
      <v-col>
        <span :class="getClassColor">{{ getScale }}</span>
      </v-col>

      <v-col cols="4" class="text-center text-md-right">
        <span class="font-weight-bold text-h6 text-md-h4">
          {{ `${(getDataCurrent.value === undefined) ? 0 : getDataCurrent.value}%` }}
        </span>
      </v-col>
    </v-row>

    <div class="pb-6">
      <underlined-title class="text-h6" text="What is this?" />
    </div>

    <p class="text-body-1 text-lg-h7 progress-text text-justify" v-html="getTextWhatIsThis" />
  </v-container>
</template>

<script>
export default {
  name: 'DetailProgress',

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
  }
}
</script>

<style lang="scss" scoped>
.detail-progress {
  &-wrapper {
    width: 100%;
  }
  &-image {
    width: 380px;
    float: left;
    img {
      width: 380px;
    }
  }
  &-text {
    display: inline;
  }
}

.progress-text {
  color: var(--v-black-base) !important;
  line-height: 28px !important;
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
