<template>
  <main class="overlay">
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
.overlay {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 7;
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
    max-width: 550px;
    font-size: 20px;
    padding: 1rem;

    @media (max-width: $breakpoint-sm) {
      line-height: 20px;
      font-size: 16px;
    }
  }
}
</style>
