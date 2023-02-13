<template>
  <pg-dialog
    v-model="viewModal"
    max-width="600"
    content-class="pg-bg-[#FFFCFC] py-2 !pg-rounded-3xl v2-font"
    @click:outside="$emit('closeCouponDiscountModal')"
  >
    <v-col class="text-right pg-pr-3" cols="12">
      <v-btn
        icon
        color="white"
        class="pg-bg-[#F6B7D2]"
        @click="$emit('closeModal')"
      >
        <v-icon>
          mdi-close
        </v-icon>
      </v-btn>
    </v-col>

    <v-col cols="12" class="px-16">
      <p
        class="text-center font-weight-bold pg-text-[20px] pg-leading-[25px]"
      >
        We would love to give you more time to see the value of Playgarden
        Prep.
      </p>
      <br />
      <p
        class="text-center font-weight-bold pg-text-[20px] pg-leading-[25px] pg-text-[#71B2FF]"
      >
      </p>
    </v-col>

    <v-col cols="12" class="text-center">
      <v-btn
        class="px-16"
        color="primary"
        :loading="loadingBtn"
        @click="applyDiscountCode"
      >
        YES
      </v-btn>
    </v-col>

    <v-col cols="12" class="text-center pa-0 pb-5">
      <v-btn
        class="px-16"
        outlined
        color="accent"
        :loading="loadingBtn"
        @click="applyClosingLogicForFlow"
      >
        NO
      </v-btn>
    </v-col>

    <img
      src="@/assets/svg/color-dashes.svg"
      class="pg-w-full pg-mb-[-12px] px-4"
    />
  </pg-dialog>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'TechnicalIssuesCancellationModal',
  props: {
    viewModal: {
      type: Boolean,
      default: false
    }
  },
  emits: ['closeModal'],
  setup() {

  }
})
</script>
