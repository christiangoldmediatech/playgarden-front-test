<template>
  <v-col cols="12">
    <v-row no-gutters>
      <slot />
    </v-row>

    <v-row no-gutters>
      <v-col cols="12" class="text-center mb-4">
        <v-btn
          class="px-16 elevation-0 btn-text white--text"
          color="#B2E68D"
          large
          :loading="loading"
          @click="handleClick(true)"
        >
          YES, SIGN ME UP
        </v-btn>
      </v-col>

      <v-col cols="12" class="text-center pa-0 pb-5">
        <v-btn
          class="px-16 btn-text"
          text
          color="accent"
          :loading="loading"
          @click="handleClick(false)"
        >
          NO, I JUST WANT TO CANCEL
        </v-btn>
      </v-col>
    </v-row>
  </v-col>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'IntermediateCancellationModal',
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['intermediateResponse'],
  setup(_, { emit }) {
    const handleClick = (accepted: boolean) => {
      emit('intermediateResponse', accepted)
    }

    return { handleClick }
  }
})
</script>

<style lang="scss" scoped>
@import '~/assets/scss/cancellation-flow.scss';
</style>
