<template>
  <div>
    <StepTwo :mode="mode" />
  </div>
</template>

<script>

import StepTwo from '@/components/app/register/StepTwo'
import { mapGetters } from 'vuex'

export default {
  name: 'Index',

  components: {
    StepTwo
  },

  data: vm => ({
    currentStep: 3,
    mode: vm.$route.params.mode
      ? vm.$route.params.mode
      : ''
  }),

  computed: {
    ...mapGetters('auth', {
      userInfo: 'getUserInfo'
    }),

    getStep () {
      return this.currentStep
    }
  },

  created () {
    this.currentStep = (this.$route.query.step) ? Number(this.$route.query.step) : 1
    if (this.mode !== 'activate-user') {
      this.$gtm.push({
        event: 'payment_page',
        conversionID: '959213252',
        conversionLabel: 'SvccCMTX0voBEMTdsckD'
      })
    }
    this.mode = (this.userInfo.registerStepType === 'CANCELED') ? 'activate-user' : this.mode
  },

  mounted () {
    this.$nuxt.$on('set-current-step', (step) => {
      if (step) {
        this.currentStep = step
      }
    })
  },

  beforeDestroy () {
    this.$nuxt.$off('set-current-step')
  },

  methods: {
    goBack () {
      let page = {}
      if (this.mode === 'activate-user') {
        page = {
          name: 'app-inactive-subscription'
        }
      } else {
        page = {
          name: 'auth-parent',
          query: { process: 'signup', step: '1' }
        }
      }
      this.$router.push(page)
    }
  }
}
</script>
