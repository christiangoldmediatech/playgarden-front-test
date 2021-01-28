export default ({ app, store }, inject) => {
  app.$sentry.configureScope(function (scope) {
    scope.setTag('transaction_id', store.getters.transactionId)
  })
}
