export default {
  methods: {
    onSearch (value) {
      this.search = value
      this.refresh(false)
    }
  }
}
