<template>
  <div>
    <div class="lsess-cs-title-1">
      LIVE SESSIONS WILL BE
    </div>

    <div class="lsess-cs-title-2">
      Available on<br>
      November 30th
    </div>

    <div class="d-flex justify-center justify-lg-start">
      <div class="lsess-cs-time">
        <div class="lsess-cs-time-background" />
        <div class="lsess-cs-time-values pa-3">
          <div class="d-flex flex-column align-center font-weight-bold">
            <span class="lsess-cs-time-number">{{ timeLeft.days }}</span>
            days
          </div>
          <div class="d-flex flex-column align-center font-weight-bold">
            <span class="lsess-cs-time-number">{{ timeLeft.hours }}</span>
            hours
          </div>
          <div class="d-flex flex-column align-center font-weight-bold">
            <span class="lsess-cs-time-number">{{ timeLeft.minutes }}</span>
            minutes
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ComingSoon',

  data: () => {
    return {
      interval: null,
      timeLeft: {
        days: 0,
        hours: 0,
        minutes: 0
      }
    }
  },

  mounted () {
    const countDownDate = new Date('Nov 30, 2020 00:00:00').getTime()

    const getTime = () => {
      // Get today's date and time
      const now = new Date().getTime()

      // Find the distance between now and the count down date
      const distance = countDownDate - now

      // Time calculations for days, hours, minutes and seconds
      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))

      this.timeLeft = {
        days,
        hours,
        minutes
      }

      // If the count down is finished, write some text
      if (distance < 0) {
        clearInterval(this.interval)
      }
    }

    getTime()

    this.interval = window.setInterval(getTime, 60000)
  },

  beforeDestroy () {
    if (this.interval) {
      window.clearInterval(this.interval)
      this.interval = null
    }
  }
}
</script>

<style lang="scss">
.lsess {
  &-cs {
    &-title-1 {
      font-weight: 600;
      font-size: 34px;
      line-height: 51px;
      text-align: center;
      @media screen and (min-width: 1264px) {
        text-align: left;
      }
    }
    &-title-2 {
      font-weight: bold;
      color: #F89838;
      font-size: 50px;
      line-height: 65px;
      text-align: center;
      @media screen and (min-width: 1264px) {
        font-size: 76px;
        line-height: 100px;
        text-align: left;
      }
      @media screen and (min-width: 1904px) {
        font-size: 101px;
        line-height: 137px;
      }
    }
    &-time {
      width: 100%;
      max-width: 559px;
      position: relative;
      &-background {
        position: absolute;
        bottom: 0;
        background-color: rgba(194, 218, 165, 0.18);
        width: 100%;
        height: 56%;
      }
      &-values {
        display: flex;
        justify-content: space-between;
      }
      &-number {
        font-weight: bold;
        font-size: 75px;
        line-height: 112px;
        color: #C2DAA5;
      }
    }
  }
}
</style>
