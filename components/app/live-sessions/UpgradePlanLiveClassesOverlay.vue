<template>
  <v-overlay z-index="5">
    <div class="upgrade-overlay">
      <div class="d-flex align-center mb-3 mb-lg-10">
        <img
          class="upgrade-overlay-icon"
          src="@/assets/svg/sessions-camera-upgrade.svg"
        >
        <div class="upgrade-overlay-title">
          LIVE CLASSES
        </div>
      </div>

      <div class="upgrade-overlay-text">
        Your Learn and Play plan gives you access to only 1 Live Class per week, if you want to get rid of this limitation please upgrade your plan.
      </div>

      <div class="upgrade-overlay-circle">
        <div class="upgrade-overlay-circle-inner">
          <div class="mt-n2 mt-lg-n7">
            <img
              class="upgrade-overlay-lock"
              src="@/assets/svg/sessions-locked.svg"
            >
            <div class="to-unlock-text">
              To unlock
            </div>

            <div class="upgrade-text clickable" @click="openPlanUpgradeModal">
              Upgrade your Plan
            </div>
          </div>
        </div>
      </div>
    </div>
  </v-overlay>
</template>

<script lang="ts">
import { defineComponent, useStore } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'UpgradeLearnAndPlayOverlay',

  setup () {
    const store = useStore()

    const openPlanUpgradeModal = () => {
      store.commit('notifications/SET_PLAN_UPGRADE_MODAL_VISIBILITY', true)
    }

    return {
      openPlanUpgradeModal
    }
  }
})
</script>

<style lang="scss" scoped>
.upgrade-overlay {
  position: fixed;
  width: 95vw;
  top: 128px;
  left: 2.5vw;
  display: flex;
  flex-direction: column;
  align-items: center;

  .upgrade-overlay-icon {
    width: 46px;
    height: 46px;
    margin-right: 15px;
    object-fit: contain;

    @media screen and (min-width: 1280px) {
      width: 71px;
      height: 71px;
      margin-right: 39px;
    }
  }

  .upgrade-overlay-title {
    font-weight: 500;
    font-size: 26px;
    line-height: 1.5;
    letter-spacing: 3px;
    @media screen and (min-width: 1280px) {
      font-size: 50px;
    }
  }

  .upgrade-overlay-text {
    max-width: 890px;
    font-weight: 400;
    font-size: 15px;
    text-align: center;
    line-height: 2;
    margin-bottom: 30px;
    @media screen and (min-width: 1280px) {
      font-size: 25px;
      line-height: 1.5;
      margin-bottom: 30px;
    }
  }

  .upgrade-overlay-circle {
    width: 187px;
    max-width: 187px;
    height: 187px;
    max-height: 187px;
    box-shadow: 0px 3px 6px 0px #00000029;
    border: 19px solid #68C453;
    background-color: #F2F2F2;
    border-radius: 50%;
    position: relative;
    @media screen and (min-width: 1280px) {
      width: 335px;
      max-width: 335px;
      height: 335px;
      maX-height: 335px;
    }

    .upgrade-overlay-circle-inner {
      width: 169px;
      min-width: 169px;
      max-width: 169px;
      height: 169px;
      min-height: 16px;
      max-height: 169px;
      border: 15px solid #B2E68D;
      box-shadow: 0px 3px 6px 0px #00000029;
      background-color: #F2F2F2;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      left: -9px;
      top: -9px;
      @media screen and (min-width: 1280px) {
        width: 301px;
        min-width: 301px;
        max-width: 301px;
        height: 301px;
        min-height: 301px;
        max-height: 301px;
        top: -2px;
        left: -2px;
      }
    }
  }

  .upgrade-overlay-lock {
    width: 38px;
    height: 48px;
    object-fit: contain;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 5px;
    display: block;
    @media screen and (min-width: 1280px) {
      width: 67px;
      height: 86px;
    }
  }

  .to-unlock-text {
    font-weight: 800;
    font-size: 13px;
    line-height: 1.5;
    text-align: center;
    color: #606060;
    @media screen and (min-width: 1280px) {
      font-size: 26px;
    }
  }

  .upgrade-text {
    font-weight: 700;
    font-size: 16px;
    line-height: 1.5;
    letter-spacing: 0.96px;
    text-align: center;
    color: #FFAB37;
    text-decoration: underline;

    @media screen and (min-width: 1280px) {
      font-size: 22px;
    }
  }
}
</style>
