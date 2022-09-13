<template>
  <div
    :class="[
      'pg-flex',
      'pg-flex-col',
      'pg-text-center',
    ]"
  >
    <div>
      <underlined-title
        text="Play and Learn for family fun and well-being!"
        font-size="24px"
        font-size-mobile="20px"
      />
    </div>
    <div>
      <span class="subtitle">Start learning together now, cancel any time!</span>
    </div>

    <div
      :class="[
        'pg-flex',
        'pg-flex-col',
        'pg-mt-3',
        'pg-p-2',
        'pg-text-center',
        'pg-shadow-[0px_8px_24px_rgba(0,0,0,0.15)]',
        'pg-rounded-lg',
        'pg-bg-white',
        'pg-max-w-full',
      ]"
    >
      <div
        :class="[
          'pg-w-full',
          'pg-h-full',
          'pg-flex',
          'pg-flex-col',
          'pg-text-center',
          'pg-p-2',
          'pg-border-solid',
          'pg-border-1',
          'pg-border-[#C399ED]'
        ]"
      >
        <div>
          <span class="card-title">Learning, parenting and well-being platform</span>
        </div>

        <div
          :class="[
            'pg-grid',
            'pg-grid-cols-1',
            'pg-mt-8',
            'lg:pg-grid-cols-12'
          ]"
        >
          <div class="pg-col-span-full lg:pg-col-span-6">
            <div
              v-for="(item, index) in leftColumn"
              :key="index"
              class="pg-flex pg-items-start pg-mb-4 pg-pr-1"
            >
              <img :src="item.icon" class="pg-mr-2">
              <span class="option">{{ item.text }}</span>
            </div>
          </div>

          <div class="pg-col-span-full lg:pg-col-span-6">
            <div
              v-for="(item, index) in rightColumn"
              :key="index"
              class="pg-flex pg-items-start pg-mb-4 pg-pr-1"
            >
              <img :src="item.icon" class="pg-mr-2">
              <span class="option">{{ item.text }}</span>
            </div>
          </div>
        </div>

        <div
          :class="[
            'pg-w-full',
            'pg-border',
            'pg-border-dashed',
            'pg-border-t-2',
            'pg-border-l-0',
            'pg-border-r-0',
            'pg-border-b-0',
            'pg-border-[#C399ED]',
            'pg-mt-1'
          ]"
        >
          <!-- Bill monthly/anually switch -->
          <div class="pg-flex pg-justify-center">
            <div class="pg-flex pg-items-center">
              <span class="pg-mr-3 pg-font-semibold">Bill Monthly</span>
              <!-- <v-switch color="#FFA0C8" inset />
              <span class="pg-font-semibold">Bill Annually</span> -->
            </div>
          </div>

          <div v-if="monthlyPricing" class="pg--mt-8">
            <span class="pricing">${{ monthlyPricing }}/month</span>
          </div>

          <div class="pg--mt-2">
            <span class="pricing-subtitle">NO CREDIT CARD REQUIRED!</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, useStore, onMounted } from '@nuxtjs/composition-api'
import UnderlinedTitle from '@/plugins/globalPartials/UnderlinedTitle.vue'
import { TypedStore } from '@/models'

export default defineComponent({
  name: 'PlayLearnPromoInfo',
  components: {
    UnderlinedTitle
  },
  setup() {
    const store = useStore<TypedStore>()

    const monthlyPricing = ref(0)

    const cardOptions = ref([
      {
        icon: require('@/assets/svg/play-learn/orange.svg'),
        text: '1000s of Video lessons from our Certified Teachers'
      },
      {
        icon: require('@/assets/svg/play-learn/green.svg'),
        text: 'Teacher led videos for everyday parenting help'
      },
      {
        icon: require('@/assets/svg/play-learn/yellow.svg'),
        text: 'Snack recipes and how-to videos to introduce new foods'
      },
      {
        icon: require('@/assets/svg/play-learn/green-2.svg'),
        text: 'Well-being blogs, webinars and community'
      },
      {
        icon: require('@/assets/svg/play-learn/pink.svg'),
        text: '100s of Do-It-Together activities, games and art projects'
      },
      {
        icon: require('@/assets/svg/play-learn/yellow-2.svg'),
        text: 'Book recommendations with videos to read along'
      },
      {
        icon: require('@/assets/svg/play-learn/orange-2.svg'),
        text: 'A Kids Corner, to let little ones learn and have fun on their own'
      },
      {
        icon: require('@/assets/svg/play-learn/purple.svg'),
        text: 'Family membership for multiple children and caregivers'
      }
    ])

    const leftColumn = computed(() => cardOptions.value.slice(0, 4))
    const rightColumn = computed(() => cardOptions.value.slice(4, 8))

    const getPlanPricing = async () => {
      const planInfo = await store.dispatch('plans/getPlanInfo', 1)
      monthlyPricing.value = planInfo.priceMonthly
    }

    onMounted(async () => {
      await getPlanPricing()
    })

    return {
      leftColumn,
      rightColumn,
      monthlyPricing
    }
  }
})
</script>

<style lang="scss" scoped>
.subtitle {
  font-weight: 400;
  font-size: 16px;
  line-height: 30px;
  text-align: center;
  color: #606060;
}

.card-title {
  font-family: 'Quicksand';
  font-weight: 600;
  font-size: 26px;
  line-height: 40px;
  color: #FFA0C8;
}

.option {
  font-weight: 400;
  font-size: 15px;
  line-height: 27px;
  color: #606060;
  display: block;
  text-align: left;
}

.pricing {
  font-family: 'Quicksand';
  font-weight: 700;
  font-size: 50px;
  line-height: 88px;
  color: #C193B8;

  @media (max-width: $breakpoint-sm) {
    font-size: 40px;
  }

}

.pricing-subtitle {
  font-weight: 400;
  font-size: 16px;
  line-height: 27px;
  color: #606060;
  mix-blend-mode: normal;
  opacity: 0.49;
}
</style>
