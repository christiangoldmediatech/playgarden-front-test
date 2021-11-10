<template>
  <div class="overlay bg-image">
    <main class="overlay overlayContent">
      <section class="promptMessage">
        <div class="d-flex align-center">
          <img
            :src="require('@/assets/png/person-with-laptop.png')"
            alt="lessons image"
            height="60"
          >
          <div class="text-h5 text-md-h4 ml-4">
            DAILY LESSONS
          </div>
        </div>

        <p class="mt-4 text-center">
          Upgrade your plan to have access to daily lessons with your favorite playgarden prep teachers
        </p>
      </section>
      <PlanUpgradePrompt />
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import PlanUpgradePrompt from '@/components/app/payment/PlanUpgradePrompt.vue'

export default defineComponent({
  name: 'UnlockPrompt',
  components: {
    PlanUpgradePrompt
  }
})
</script>

<style lang="scss" scoped>
.bg-image {
  background-image: url('~assets/png/lessons-image.png');
  background-repeat: no-repeat;
  background-position: center center;
  background-attachment: fixed;
  background-size: cover;
}

.overlay {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 6;
  min-height: 500px;
}

.overlayContent {
  z-index: 7;
  background-color: #80808000;
  background-color: rgb(0, 0, 0, 0.6);
  color: white;
  min-height: 500px;
  padding-top: 150px;
}

.promptMessage {
  display: grid;
  justify-items: center;
  margin-bottom: 20px;

  p {
    max-width: 520px;
    font-size: 20px;

    @media (max-width: $breakpoint-sm) {
      line-height: 20px;
      font-size: 16px;
    }
  }
}
</style>
