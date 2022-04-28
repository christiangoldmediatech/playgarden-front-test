<template>
  <div
    class="ribbon-color text-center d-flex flex-column flex-md-row align-center justify-center py-2"
    :class="{ 'ribbon-fixed-top': isFixedOnTop }"
  >
    <span class="white--text font-weight-bold mx-2">Your free trial will expire in: </span>
    <span class="time">
      <underlined-title
        class="white--text"
        :text="countdownTime"
        font-size="32px"
        line-color="rgba(255,255,255,0.15)"
        :line-from="30"
      />
      <span class="white--text">Days</span>
    </span>
    <v-btn
      v-if="isComparePlansButtonVisible"
      small
      class="text-none accent--text mx-2"
      nuxt
      :to="{ name: 'app-payment-plan' }"
    >
      Compare plans now
    </v-btn>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getCountdownToDate } from '@/utils/dateTools'

const EXPIRED_TIME_STRING = '0:00:00'

export default {
  name: 'TrialIsExpiring',

  props: {
    isComparePlansButtonVisible: {
      type: Boolean,
      default: true
    },
    isFixedOnTop: {
      type: Boolean,
      default: true
    }
  },

  data () {
    return {
      intervalId: undefined,
      countdownTime: ''
    }
  },

  computed: {
    ...mapGetters('auth', ['getUserInfo'])
  },

  watch: {
    countdownTime: {
      immediate: true,
      handler (value) {
        if (value === EXPIRED_TIME_STRING) {
          this.$emit('expired')
        }
      }
    }
  },

  mounted () {
    const trialExpiresDate = this.getUserInfo.trialEnd
    this.countdownTime = getCountdownToDate(trialExpiresDate, EXPIRED_TIME_STRING)

    const oneMinute = 1000 * 60
    this.intervalId = setInterval(() => {
      this.countdownTime = getCountdownToDate(trialExpiresDate, EXPIRED_TIME_STRING)
    }, oneMinute)
  },

  beforeDestroy () {
    clearInterval(this.intervalId)
  }
}
</script>

<style lang="scss" scoped>
.ribbon-fixed-top {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
}
.ribbon-color {
  background-color: #F89838;
}
.time {
  width: 215px !important;
}
.v-btn:not(.v-btn--text) {
  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.15) !important;
}
</style>
