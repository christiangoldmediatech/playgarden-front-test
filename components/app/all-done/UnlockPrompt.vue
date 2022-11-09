<template>
  <main class="overlay" :style="{ 'top': `${top}px` }">
    <section class="promptMessage" :style="{ 'padding-top': `${padding}px` }">
      <v-row class="">
        <v-col :cols="vertical ? 12 : 5" :order="vertical ? 2 : 1">
          <PlanUpgradePrompt />
        </v-col>
        <v-col :cols="vertical ? 12 : 7" :order="vertical ? 1 : 2">
          <v-row justify="center" :class="{ 'flex-column': vertical }">
            <div class="d-flex align-center" :class="{ 'justify-center': vertical }">
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
            <div>
              <p class="mt-4 text-center">
                {{ desc }}
              </p>
            </div>
          </v-row>
        </v-col>
      </v-row>
    </section>
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
    },
    vertical: {
      type: Boolean,
      default: false
    },
    top: {
      type: Number,
      default: 0
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
