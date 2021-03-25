<template>
  <error-page
    :title="title"
    :description="description"
    :img="img"
  />
</template>

<script>
import ErrorPage from '@/components/error/ErrorPage'

export default {
  name: 'Error',

  components: { ErrorPage },

  props: {
    error: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      sadBoySpiral: require('@/assets/png/sad-boy-spiral.png'),
      title: '',
      description: '',
      img: ''
    }
  },

  created () {
    this.handleErrorType()
  },

  methods: {
    handleErrorType () {
      const statusCode = this.error.statusCode

      switch (statusCode) {
        case 404:
          this.title = 'PAGE NOT FOUND'
          this.description = 'The page you request could not be found!'
          this.img = this.sadBoySpiral
          break
        default:
          this.title = 'UNKNOWN ERROR'
          this.description = 'An unknown error ocurred.'
          this.img = this.sadBoySpiral
      }
    }
  }
}
</script>
