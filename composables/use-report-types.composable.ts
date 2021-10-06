import { ReportCardType } from '@/models/report-card-type.model'
import { axios } from '@/utils'
import { ref } from '@nuxtjs/composition-api'

const reportCardTypes = ref<ReportCardType[]>([])

export const useReportCardTypes = () => {
  const getReportCardTypes = async (params?: unknown) => {
    reportCardTypes.value = await axios.$get('/report-card-types', { params })
  }

  return {
    reportCardTypes,
    getReportCardTypes
  }
}
