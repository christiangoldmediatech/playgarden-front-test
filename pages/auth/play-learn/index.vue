<template>
  <div>
    <div
      :class="[
        'pg-flex',
        'pg-flex-col',
        'pg-bg-[url(@/assets/png/play-learn/acuarela-yellow.png)]',
        'pg-bg-[center_right_-10rem]',
        'pg-pb-32'
      ]"
    >
      <div class="pg-mt-4">
        <BackButton @click="handleGoBack" />
      </div>

      <!-- HEADING -->
      <div
        :class="[
          'pg-mt-4',
          'pg-inline',
          'pg-text-4xl',
          'pg-font-bold',
          'pg-tracking-[4.8px]',
          'pg-leading-[48px]',
        ]"
      >
        <img src="@/assets/svg/play-learn/play-learn-logo.svg" class="pg-mr-2 pg-h-14 pg-mb-[-16px] pg-text-black">
        IS COMPLETELY FREE FOR THE FIRST 15 DAYS!
      </div>

      <div class="pg-text-xl pg-text-black pg-opacity-50">
        Create an account to start learning
      </div>

      <!-- CONTENT -->
      <div
        :class="[
          'pg-grid',
          'pg-grid-cols-1',
          'md:pg-grid-cols-12',
          'pg-gap-24',
          'pg-mt-8',
        ]"
      >
        <!-- LEFT -->
        <div class="pg-col-span-full md:pg-col-span-7">
          <RegisterForm
            :loading="isLoading"
            :is-credit-card-required="true"
            @click:submit="handleSubmit"
          />
        </div>

        <!-- RIGHT -->
        <div class="pg-col-span-full md:pg-col-span-5">
          <InfoCard />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, useRouter } from '@nuxtjs/composition-api'
import BackButton from '@/components/app/learn-play/BackButton/BackButton.vue'
import RegisterForm from '@/components/forms/auth/RegisterForm.vue'
import InfoCard from '@/components/app/learn-play/InfoCard/InfoCard.vue'

export default defineComponent({
  name: 'AuthPlayLearnIndex',

  layout: 'learn-play',

  components: {
    BackButton,
    RegisterForm,
    InfoCard
  },

  setup() {
    const isLoading = ref(false)
    const router = useRouter()

    function handleGoBack() {
      router.go(-1)
    }

    function handleSubmit() {}

    return {
      isLoading,
      handleSubmit,
      handleGoBack
    }
  }
})
</script>
