export default async (context, locale) => {
  if (context.env.apiBaseUrl !== context.$axios.defaults.baseURL) {
    context.$axios.defaults.baseURL = context.env.apiBaseUrl
  }

  const response = await context.$axios.$get('/i18n/es')
  return {
    ...response.content,
    paymentPlan: {
      ...response.content.paymentPlan,
      bestFor: 'Ideal para familias que buscan:'
    }
  }
}
