<template>
  <v-overlay v-if="hasPlayAndLearnPlan" z-index="5">
    <v-container fluid>
      <div class="upgrade-overlay">
        <v-row>
          <v-col cols="4">
            <div class="pg-mt-[70px] pg-float-right">
              <div class="upgrade-overlay-circle">
                <div class="upgrade-overlay-circle-inner">
                  <div class="mt-n2 mt-lg-n7">
                    <img
                      class="upgrade-overlay-lock"
                      src="@/assets/svg/sessions-locked.svg"
                    />
                    <div class="to-unlock-text">
                      To unlock
                    </div>

                    <div
                      class="upgrade-text clickable"
                      @click="openPlanUpgradeModal"
                    >
                      Upgrade your Plan
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </v-col>
          <v-col cols="8">
            <v-row justify="center">
              <div class="pg-mt-[70px] d-flex align-center mb-3 mb-lg-9">
                <img
                  class="upgrade-overlay-icon"
                  src="@/assets/svg/sessions-camera-upgrade.svg"
                />
                <div class="upgrade-overlay-title">
                  LIVE CLASSES
                </div>
              </div>

              <div class="upgrade-overlay-text">
                Your Play and Learn plan gives you access to only 1 Live Class
                per week, if you want to get rid of this limitation please
                upgrade your plan.
              </div>
            </v-row>
          </v-col>
        </v-row>
      </div>
    </v-container>
  </v-overlay>
</template>

<script lang="ts">
import { computed, defineComponent, useStore } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'UpgradeLearnAndPlayOverlay',

  setup() {
    const store = useStore()

    const openPlanUpgradeModal = () => {
      store.commit('notifications/SET_PLAN_UPGRADE_MODAL_VISIBILITY', true)
    }

    const hasPlayAndLearnPlan = computed(() => {
      return store.getters['auth/hasPlayAndLearnPlan']
    })

    return {
      hasPlayAndLearnPlan,
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
    border: 19px solid #68c453;
    background-color: #f2f2f2;
    border-radius: 50%;
    position: relative;
    @media screen and (min-width: 1280px) {
      width: 335px;
      max-width: 335px;
      height: 335px;
      max-height: 335px;
    }

    .upgrade-overlay-circle-inner {
      width: 169px;
      min-width: 169px;
      max-width: 169px;
      height: 169px;
      min-height: 16px;
      max-height: 169px;
      border: 15px solid #b2e68d;
      box-shadow: 0px 3px 6px 0px #00000029;
      background-color: #f2f2f2;
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
    color: #ffab37;
    text-decoration: underline;

    @media screen and (min-width: 1280px) {
      font-size: 22px;
    }
  }
}
</style>
