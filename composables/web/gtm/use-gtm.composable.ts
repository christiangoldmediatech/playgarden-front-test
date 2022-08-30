import { useGtmHelper } from '@/composables/helpers.composable'

export const useGtm = () => {
  const gtm = useGtmHelper()

  function parentPage(opts: { conversionID: string; conversionLabel: string }) {
    gtm.push({
      event: 'parent_page',
      conversionID: opts.conversionID,
      conversionLabel: opts.conversionLabel
    })
  }

  function paymentPage(opts: { conversionID: string; conversionLabel: string }) {
    gtm.push({
      event: 'payment_page',
      conversionID: opts.conversionID,
      conversionLabel: opts.conversionLabel
    })
  }

  return {
    parentPage,
    paymentPage
  }
}
