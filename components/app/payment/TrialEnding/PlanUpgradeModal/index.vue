<template>
  <large-image-content-dialog
    :value="isPlanUpgradeModalVisible"
    :img="imagePath"
    :is-closeable="true"
    @close="handleModalCloseRequest"
  >
    <div class="popularity pa-2 pa-md-3 text-body-2 text-md-h6">
      Most Popular
    </div>

    <underlined-title
      text="ONLINE PRESCHOOL"
      font-size="32px"
      font-size-mobile="22px"
      letter-spacing="1px"
      class="mb-4 d-inline-block"
    />
    <main>
      <h2 class="my-2">
        What’s included
      </h2>
      <ul
        v-if="features"
        :style="styleVaribles"
      >
        <li
          v-for="(feature, index) in features"
          :key="index"
        >
          {{ feature }}
        </li>
      </ul>
    </main>
    <transition name="fade">
      <section
        v-if="planPrice"
        class="mt-3"
      >
        <span class="fs-20 fw-500"> ${{ planPrice }} / month </span>
        <v-btn
          x-large
          color="accent"
          width="250"
          :disabled="upgradeStatus === 'processing' || upgradeStatus === 'upgraded'"
          :loading="upgradeStatus === 'processing'"
          @click="handleRequestToUpgradePlan"
        >
          <span class="fs-18 white--text">{{ upgradeButtonText }}</span>
        </v-btn>
      </section>
    </transition>
  </large-image-content-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, useContext, useStore, onMounted, ref } from '@nuxtjs/composition-api'
import LargeImageContentDialog from '@/components/ui/dialogs/LargeImageContentDialog/LargeImageContentDialog.vue'
import { Plan, TypedStore } from '@/models'
import { useNotification } from '@/composables'

const imagePath = require('@/assets/jpg/payment-upgrade.jpeg')
const PLAN_DETAILS_PATH = '/plans/2'
const PLAN_UPGRADE_PATH = '/auth/user/plan/2/monthly'

const UPGRADE_STATUS_AND_LABEL = {
  uninitiated: 'Upgrade Plan',
  processing: 'Upgrading...',
  failed: 'Try Later',
  upgraded: 'Upgraded!'
} as const

type UpgradeStatus = keyof typeof UPGRADE_STATUS_AND_LABEL

export default defineComponent({
  name: 'PlanUpgrdeModal',
  components: {
    LargeImageContentDialog
  },
  setup () {
    const store = useStore<TypedStore>()
    const { $vuetify, $axios } = useContext()
    const plan = ref<Plan | null>(null)
    const upgradeStatus = ref<UpgradeStatus>('uninitiated')

    const {
      isPlanUpgradeModalVisible,
      setIsPlanUpgradeModalVisible,
      setIsTrialEndingPlanSelectedModalVisible,
      setLessonUnavailability
    } = useNotification({ store })

    onMounted(async () => {
      const data = await $axios.$get(PLAN_DETAILS_PATH)
      plan.value = data
    })

    const features = computed(() => {
      if (!plan.value) { return null }
      const benefits: string[] = [...plan.value.commonBenefits.benefits]
      if (plan.value.homeDeliveryBenefits?.benefits) {
        benefits.push(...plan.value.homeDeliveryBenefits.benefits)
      }

      return benefits
    })

    const planPrice = computed(() => plan.value?.priceMonthly)

    const styleVaribles = computed(() => ({
      '--no-of-rows': $vuetify.breakpoint.xs ? features.value?.length : Math.round(Number(features.value?.length) / 2)
    }))

    const upgradeButtonText = computed(() => UPGRADE_STATUS_AND_LABEL[upgradeStatus.value])

    function handleModalCloseRequest () {
      store.commit('notifications/SET_PLAN_UPGRADE_MODAL_VISIBILITY', false)
    }

    async function handleRequestToUpgradePlan () {
      upgradeStatus.value = 'processing'
      try {
        await $axios.$patch(PLAN_UPGRADE_PATH)
        upgradeStatus.value = 'upgraded'
        setLessonUnavailability(false)
        setIsPlanUpgradeModalVisible(false)
        setIsTrialEndingPlanSelectedModalVisible(true)
      } catch (error) {
        upgradeStatus.value = 'failed'
        // eslint-disable-next-line no-console
      } finally {
        store.dispatch('auth/fetchUserInfo')
      }
    }

    return {
      isPlanUpgradeModalVisible,
      handleModalCloseRequest,
      imagePath,
      features,
      styleVaribles,
      handleRequestToUpgradePlan,
      planPrice,
      upgradeStatus,
      upgradeButtonText
    }
  }
})
</script>

<style lang="scss" scoped>
$grey: #707070;
$number-of-features: 14; // Update this when the number of features change.

main {
  h2 {
    color: $grey;
  }

  ul {
    list-style: none;
    column-gap: 1.5rem;
    row-gap: 0.5rem;
    list-style: none;
    display: grid;
    grid-auto-flow: column;
    grid-template-rows: repeat(var(--no-of-rows), max-content);

    li {
      display: flex;
      color: $grey;
      line-height: 25px;

      &::before {
        content: '•';
        color: var(--v-accent-base);
        display: inline-block;
        font-size: 60px;
        margin-left: -1.5rem;
        margin-right: 0.2rem;
      }
    }
  }
}

.popularity {
  position: absolute;
  top: 0;
  right: 0;
  background: rgba(255, 163, 72, 0.8);
  border-radius: 0px 0px 3px 16px;
  font-weight: bold;
  color: white;
}

section {
  display: grid;
  gap: 1rem;
  justify-items: center;
  justify-content: center;
  flex-wrap: wrap;
  align-items: center;

  span {
    color: $grey;
  }
}
</style>
