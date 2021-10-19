<template>
  <large-image-content-dialog
    :value="isPlanUpgradeModalVisible"
    :img="imagePath"
    :is-closeable="true"
    @close="handleModalCloseRequest"
  >
    <underlined-title
      text="Preschool @ Home"
      font-size="32px"
      font-size-mobile="22px"
      letter-spacing="1px"
      class="mb-4 d-inline-block"
    />
    <main>
      <h2 class="my-2">
        What’s included
      </h2>
      <ul :style="styleVaribles">
        <li
          v-for="(feature, index) in features"
          :key="index"
        >
          {{ feature }}
        </li>
      </ul>
    </main>
    <section class="my-2">
      <span>Currency: </span>
      <CurrencySelector class="currencySelector" />
    </section>
    <section>
      <v-btn
        x-large
        color="accent"
        width="250"
        @click="handleRequestToChoosePlan"
      >
        Choose Plan
      </v-btn>

      <v-btn
        x-large
        color="accent"
        outlined
        class="text-none"
        width="200"
        @click="handleRequestToComparePlans"
      >
        Compare Plans
      </v-btn>
    </section>
  </large-image-content-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, useContext, useStore } from '@nuxtjs/composition-api'
import LargeImageContentDialog from '@/components/ui/dialogs/LargeImageContentDialog/LargeImageContentDialog.vue'
import CurrencySelector from '@/components/app/payment/SubscriptionPlanSelection/currencySelector.vue'
import { TypedStore } from '@/models'
import { features } from './constants'

const imagePath = require('@/assets/jpg/payment-upgrade.jpeg')

export default defineComponent({
  name: 'PlanUpgrdeModal',
  components: {
    LargeImageContentDialog,
    CurrencySelector
  },
  setup () {
    const store = useStore<TypedStore>()
    const { $vuetify } = useContext()

    const isPlanUpgradeModalVisible = computed(() => store.state.notifications.isPlanUpgradeModalVisible)

    const styleVaribles = computed(() => ({
      '--no-of-rows': $vuetify.breakpoint.xs ? features.length : features.length / 2
    }))

    function handleModalCloseRequest () {
      store.commit('notifications/SET_PLAN_UPGRADE_MODAL_VISIBILITY', false)
    }

    function handleRequestToChoosePlan () {
      // to be implemented
    }
    function handleRequestToComparePlans () {
      // to be implemented
    }

    return {
      isPlanUpgradeModalVisible,
      handleModalCloseRequest,
      imagePath,
      features,
      styleVaribles,
      handleRequestToChoosePlan,
      handleRequestToComparePlans
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
    row-gap: 0.75rem;
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

section {
  display: flex;
  gap: 1rem;
  justify-items: center;
  justify-content: center;
  flex-wrap: wrap;
  align-items: center;
}

.currencySelector {
  max-width: 150px;
}
</style>
