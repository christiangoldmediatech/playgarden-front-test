export default {
  data: () => ({
    pagination: {
      limit: 10,
      page: 1,
      total: 0
    }
  }),

  methods: {
    setPagination ({ page, total }) {
      this.pagination.page = Number(page)
      this.pagination.total = Number(total)
    }
  }
}
