<template>
  <pg-dialog
    v-model="viewCancelAnywayModal"
    max-width="600"
    content-class="pg-bg-[#FFFCFC] py-2 !pg-rounded-3xl v2-font"
    @click:outside="$emit('closeCancelAnywayModal')"
  >
    <v-col class="text-right pg-pr-3" cols="12">
      <v-btn icon color="white" class="pg-bg-[#F6B7D2]" @click="$emit('closeCancelAnywayModal')">
        <v-icon>
          mdi-close
        </v-icon>
      </v-btn>
    </v-col>

    <v-col cols="12" class="px-16">
      <img
        src="@/assets/png/triste.png"
        class="pg-w-4/12 pg-block pg-mx-auto"
        alt="Sad computer"
      />
    </v-col>

    <v-col cols="12" class="px-16">
      <p
        class="text-center font-weight-bold pg-text-[20px] pg-leading-[25px] pg-text-[#71B2FF]"
      >
        We are sad to see you go.
      </p>
      <p
        class="text-center font-weight-bold pg-text-[20px] pg-leading-[25px] pg-text-primary"
      >
        Thank you for your feedback!
      </p>
    </v-col>

    <v-col cols="12" class="text-center pa-0 pb-5">
      <v-btn class="px-16" plain color="accent" @click="$emit('closeCancelAnywayModal')">
        CLOSE
      </v-btn>
    </v-col>

    <img
      src="@/assets/svg/color-dashes.svg"
      class="pg-w-full pg-mb-[-12px] px-4"
    />
  </pg-dialog>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'CancelAnyway',
  props: {
    viewCancelAnywayModal: Boolean
  }
})
</script>

<style></style>
