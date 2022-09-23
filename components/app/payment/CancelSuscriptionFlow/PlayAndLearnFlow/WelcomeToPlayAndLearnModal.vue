<template>
  <pg-dialog
    v-model="viewWelcomeToPlayAndLearnModal"
    max-width="600"
    content-class="pg-bg-[#FFFCFC] py-2 !pg-rounded-3xl"
    @click:outside="goHome"
  >
    <v-col class="text-right pg-pr-3" cols="12">
      <v-btn icon color="white" class="pg-bg-[#F6B7D2]" @click="goHome">
        <v-icon>
          mdi-close
        </v-icon>
      </v-btn>
    </v-col>

    <v-col cols="12" class="px-16 text-center">
      <p
        class="font-weight-medium pg-text-[25px] pg-leading-[40px] pg-text-accent"
      >
        WELCOME TO
      </p>
      <img src="@/assets/png/logo-play-and-learn-sub.png" alt="Learn and Play logo" class="pg-w-8/12 pg-mb-5 px-4">
    </v-col>

    <v-col cols="12" class="text-center">
      <v-btn class="px-16" color="primary" @click="goHome">
        START
      </v-btn>
    </v-col>

    <v-col cols="12" class="text-center pa-0 pb-5">
      <v-btn class="px-16" plain color="accent" @click="goHome">
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
import { defineComponent, useRouter } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'WelcomeToPlayAndLearnModal',
  props: {
    viewWelcomeToPlayAndLearnModal: Boolean
  },
  setup() {
    const router = useRouter()

    const goHome = () => {
      router.replace({ name: 'app-virtual-preschool' })
    }

    return {
      goHome
    }
  }
})
</script>

  <style></style>
