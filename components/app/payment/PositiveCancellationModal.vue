<template>
  <pg-dialog
    v-model="viewModal"
    max-width="600"
    content-class="pg-bg-[#FFFCFC] py-2 !pg-rounded-3xl v2-font"
    @click:outside="closeModal"
  >
    <v-col class="text-right pg-pr-3" cols="12">
      <v-btn
        icon
        color="white"
        class="pg-bg-[#F6B7D2]"
        @click="closeModal"
      >
        <v-icon>
          mdi-close
        </v-icon>
      </v-btn>
    </v-col>

    <v-col cols="12" class="pa-0">
      <v-row no-gutters justify="center">
        <img
          class="cancellation-icon"
          src="@/assets/png/happy.png"
          alt="happy icon"
        />
      </v-row>
      <v-row no-gutters justify="center">
        <h1 class="cancellation-title pg-text-[#EC85B3]">
          {{ $t('modals.positiveCancellation.title') }}
        </h1>
      </v-row>
    </v-col>

    <v-col cols="12" class="px-10 py-0">
      <slot />
    </v-col>

    <v-col cols="12" class="text-center">
      <v-btn
        class="px-16 elevation-0 btn-text white--text"
        color="#B2E68D"
        large
        @click="closeModal"
      >
        {{ $t('modals.positiveCancellation.back') }}
      </v-btn>
    </v-col>

    <img
      src="@/assets/svg/color-dashes.svg"
      class="pg-w-full pg-mb-[-12px] px-4"
    />
  </pg-dialog>
</template>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'PositiveCancellationModal',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  emits: ['input'],
  setup(props, { emit }) {
    const viewModal = computed({
      get() {
        return props.value
      },
      set(val: boolean) {
        emit('input', val)
      }
    })

    const closeModal = () => {
      viewModal.value = false
    }

    return {
      viewModal,
      closeModal
    }
  }
})
</script>

<style lang="scss" scoped>
@import '~/assets/scss/cancellation-flow.scss';
</style>
