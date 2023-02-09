<template>
  <error-page
    pre-text="OOPS!"
    :error-code="error.statusCode"
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
      sadBoySpiral: require('@/assets/png/sad-boy.png'),
      text: '',
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
          this.text = 'PAGE NOT FOUND'
          this.description = 'The page you request could not be found!'
          this.img = this.sadBoySpiral
          break
        default:
          this.text = 'UNKNOWN ERROR'
          this.description = 'An unknown error ocurred.'
          this.img = this.sadBoySpiral
      }
    }
  }
}
</script>
