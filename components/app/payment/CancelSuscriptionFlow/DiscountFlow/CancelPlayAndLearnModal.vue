<template>
  <div>
    <pg-dialog
      v-model="cancelPlayAndLearnModal"
      max-width="600"
      content-class="pg-bg-[#FFFCFC] py-2 !pg-rounded-3xl pg-relative"
      @click:outside="$emit('closeCancelPlayAndLearnModal')"
    >
      <v-col class="text-right pg-pr-3 pg-absolute pg-top-0 pg-right-0" cols="12">
        <v-btn icon color="white" class="pg-bg-[#F6B7D2]" @click="$emit('closeCancelPlayAndLearnModal')">
          <v-icon>
            mdi-close
          </v-icon>
        </v-btn>
      </v-col>

      <v-col cols="12" class="px-16">
        <p
          class="text-center font-weight-medium pg-text-[20px] pg-leading-[25px] pg-text-[#71B2FF] mb-0"
        >
          We are sad to see you go.
        </p>
        <p
          class="text-center font-weight-medium pg-text-[20px] pg-leading-[25px] pg-text-[#78C383] mb-0"
        >
          Thank you for your feedback!
        </p>
        <br />
        <p
          class="text-center font-weight-medium pg-text-[20px] pg-leading-[25px] pg-text-[#ADADAD] mb-0"
        >
          But wait
        </p>
        <p
          class="text-center font-weight-medium pg-text-[20px] pg-leading-[25px] pg-text-[#F89838]"
        >
          Take a look to our
        </p>

        <div class="pg-flex pg-justify-center">
          <img src="@/assets/svg/kids-corner.svg" />
        </div>

        <p
          class="text-center font-weight-medium pg-text-[16px] pg-leading-[25px] pg-text-[#848484]"
        >
          The KidsCorner is a safe space where learning is paired with silly, hilarious educational videos for free!
        </p>
      </v-col>

      <v-col cols="12" class="text-center">
        <v-btn class="px-16" color="primary" @click="goToKidsCorner">
          VISIT KIDS CORNER
        </v-btn>
      </v-col>

      <v-col cols="12" class="text-center pa-0 pb-5">
        <v-btn
          class="px-16 text-decoration-underline"
          text
          color="accent"
          @click="$emit('closeCancelPlayAndLearnModal')"
        >
          CLOSE
        </v-btn>
      </v-col>

      <img
        src="@/assets/svg/color-dashes.svg"
        class="pg-w-full pg-mb-[-12px] px-4"
      />
    </pg-dialog>
  </div>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'CancelPlayAndLearnModal',
  props: {
    cancelPlayAndLearnModal: Boolean
  },
  setup() {
    const goToKidsCorner = () => {
      window.open(process.env.kidsCornerUrl)
    }

    return {
      goToKidsCorner
    }
  }
})
</script>

<style></style>
