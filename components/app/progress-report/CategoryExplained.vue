<template>
  <v-row class="d-flex w-100 px-6 px-md-16 py-4 py-md-10 pg-relative" :style="{ 'background-color': lightBackgroundColor }" no-gutters>
    <div class="arrow-up pg-absolute" :style="{ 'border-bottom-color': lightBackgroundColor, 'left': arrowLeftPosition }"></div>

    <v-col cols="12" sm="12" order="2" order-md="1">
      <div class="d-flex align-center mb-4">
        <img :src="icon" class="category-icon pg-ml-[-20px]" />
        <h1 class="category-title">
          {{ data.nameCardType }}
        </h1>
      </div>
    </v-col>
    <v-col cols="12" md="7" order="3" order-md="2">
      <div class="category-description pr-4" v-html="reportDescription"></div>
    </v-col>

    <v-col cols="12" md="5" order="1" order-md="3">
      <div class="rounded-lg px-6 py-4 mb-4" :style="{ 'background-color': darkBackgroundColor }">
        <div class="category-value-description-title d-flex align-center">
          <h2 class="mr-2">
            {{ reportValueDescription.title }}
          </h2>
          <span>{{ reportValue }}</span>
        </div>

        <div class="category-value-description" v-html="reportValueDescription.description">
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { TypedStore } from '@/models'
import { computed, defineComponent, useStore } from '@nuxtjs/composition-api'
import { useLanguageHelper } from '@/composables'

export default defineComponent({
  name: 'CategoryExplained',
  props: {
    data: {
      type: Object,
      required: true,
      default: () => {}
    },
    report: {
      type: Object,
      required: true,
      default: () => {}
    }
  },
  setup(props) {
    const store = useStore<TypedStore>()
    const language = useLanguageHelper()

    const reports = computed(() => store.getters['admin/report-card/types'])

    const reportDescription = computed(() => reports.value.find((report: any) => report.name === props.data.nameCardType)?.description)

    const arrowLeftPosition = computed(() => {
      const category = props.data.nameCardType
      switch (category) {
        case language.t('studentCubby.progressReport.cognitive'):
          return '30%'
        case language.t('studentCubby.progressReport.languageAndLiteracy'):
          return '46%'
        case language.t('studentCubby.progressReport.physical'):
          return '63%'
        case language.t('studentCubby.progressReport.socialEmotional'):
          return '78%'
        default:
          return '30%'
      }
    })

    const reportValueDescription = computed(() => {
      const valueDescription: any = {
        title: '',
        description: ''
      }

      if (props.data.value !== undefined) {
        if (props.data.value <= 20) {
          valueDescription.title = language.t('studentCubby.progressReport.progressing')
          valueDescription.description = props.data.progressing
        } else if (props.data.value > 20 && props.data.value <= 80) {
          valueDescription.title = language.t('studentCubby.progressReport.progressing')
          valueDescription.description = props.data.ageAppropiate
        } else {
          valueDescription.title = language.t('studentCubby.progressReport.progressing')
          valueDescription.description = props.data.areaStrenght
        }
      }

      return valueDescription
    })

    const reportValue = computed(() => `${props.data.value} %`)

    const categoryColor = computed(() => {
      const category = props.data.nameCardType
      switch (category) {
        case language.t('studentCubby.progressReport.cognitive'):
          return '255, 164, 172'
        case language.t('studentCubby.progressReport.languageAndLiteracy'):
          return '120, 195, 131'
        case language.t('studentCubby.progressReport.physical'):
          return '105, 190, 255'
        case language.t('studentCubby.progressReport.socialEmotional'):
          return '255, 175, 75'
        default:
          return '255, 164, 172'
      }
    })

    const lightBackgroundColor = computed(() => `rgba(${categoryColor.value}, 0.2)`)
    const darkBackgroundColor = computed(() => `rgba(${categoryColor.value}, 1)`)

    const icon = computed(() => props.data.symbol.replace('image://', ''))

    return {
      lightBackgroundColor,
      icon,
      reportDescription,
      darkBackgroundColor,
      reportValueDescription,
      reportValue,
      arrowLeftPosition
    }
  }
})

</script>

<style lang="scss" scoped>
.arrow-up {
  width: 0;
  height: 0;
  top: -30px;
  border-left: 30px solid transparent;
  border-right: 30px solid transparent;
  border-bottom: 30px solid;
}

.category-icon {
  width: 100px;
  height: 60px;
  object-fit: cover;
}

.category-title {
  font-weight: 700;
  font-size: 22px;
  line-height: 44px;
  color: #606060;

  @media screen and (min-width: $breakpoint-sm) {
    font-size: 29px;
  }
}

.category-description {
  &::v-deep p {
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 27px;
    color: #606060;

    @media screen and (min-width: $breakpoint-sm) {
      font-size: 18px;
    }
  }
}

.category-value-description-title {
  h2 {
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 33px;
    color: #FFFFFF;

    @media screen and (min-width: $breakpoint-sm) {
     font-size: 22px;
    }
  }

  span {
    font-style: normal;
    font-weight: 700;
    font-size: 29px;
    line-height: 54px;
    color: #FFFFFF;

    @media screen and (min-width: $breakpoint-sm) {
      font-size: 36px;
   }
  }
}

.category-value-description {
  &::v-deep p {
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    color: #FFFFFF;

    @media screen and (min-width: $breakpoint-sm) {
      font-size: 16px;
    }
  }
}
</style>
