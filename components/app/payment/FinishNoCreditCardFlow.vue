<template>
  <pg-dialog
    :value="showDialog"
    max-width="600"
    persistent
    content-class="pg-bg-[#FFFCFC] py-2 px-10 v2-font !pg-overflow-hidden !pg-rounded-2xl !pg-relative"
  >
    <v-col class="text-right pg-pr-3" cols="12">
      <v-btn
        icon
        color="white"
        class="pg-bg-[#F6B7D2]"
        @click="closeDialog"
      >
        <v-icon>
          mdi-close
        </v-icon>
      </v-btn>
    </v-col>

    <v-col cols="12" class="ma-0 pa-0">
      <v-img :src="require('~/assets/png/child-no-cc-flow-dialog.png')" width="200" height="200" class="pg-mx-auto !pg-z-[5000]" />
    </v-col>

    <v-col cols="12" class="pa-0">
      <v-row no-gutters justify="center">
        <h1 class="pg-text-2xl pg-text-center pg-text-[#68C453]">
          {{ $t('title') }}
        </h1>
      </v-row>
    </v-col>

    <v-col cols="12" class="px-10 py-0">
      <p class="pg-text-[#606060] pg-font-bold pg-my-5 pg-text-center">
        {{ $t('text') }}
      </p>
    </v-col>

    <v-col cols="12" class="pg-my-5">
      <v-btn color="accent" class="!pg-mx-auto !pg-block !pg-w-fit" @click="$router.push({name: 'app-payment-plan'})">
        {{ $t('viewPlans') }}
      </v-btn>
    </v-col>

    <img
      src="@/assets/svg/color-dashes.svg"
      class="pg-w-full pg-mb-[-12px] px-4"
    />
  </pg-dialog>
</template>

<script>
import { defineComponent, computed, useStore, useRoute } from '@nuxtjs/composition-api'
export default defineComponent({
  name: 'FinishNoCreditCardFlow',

  setup() {
    const store = useStore()
    const route = useRoute()

    const showDialog = computed(() =>
      route.value.name.search('plan') === -1 &&
      route.value.name.search('account') === -1 &&
      store.getters['auth/getFinishNoCCFlow']
    )

    const closeDialog = () => {
      store.dispatch('auth/disableCreditCardDialog')
    }

    return {
      showDialog,
      closeDialog
    }
  }
})
</script>

<i18n src="@/lang/etc/FinishNoCreditCardFlow.locales.json"></i18n>
