<template>
  <main class="overlay">
    <section class="promptMessage" :style="{ 'padding-top': `${padding}px` }">
      <div class="d-flex align-center">
        <img
          v-if="img"
          :src="getImg(img)"
          :alt="`${title} IMAGE`"
          height="60"
        >
        <div class="text-h5 text-md-h4 ml-4">
          {{ title }}
        </div>
      </div>

      <p class="mt-4 text-center">
        {{ desc }}
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
  props: {
    title: {
      type: String,
      required: true
    },
    desc: {
      type: String,
      required: true
    },
    img: {
      type: String,
      default: null
    },
    padding: {
      type: Number,
      default: 50
    }
  },
  components: {
    PlanUpgradePrompt
  },
  methods: {
    getImg(img: string) {
      if (!img) {
        return ''
      }

      return require(`@/assets/png/${img}`)
    }
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
}

.promptMessage {
  display: grid;
  justify-items: center;
  margin-bottom: 20px;

  p {
    max-width: 1050px;
    font-size: 20px;
    padding: 1rem;

    @media (max-width: $breakpoint-sm) {
      line-height: 20px;
      font-size: 16px;
    }
  }
}
</style>
