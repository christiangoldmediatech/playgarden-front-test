<template>
  <div class="lg:pg-pb-32">
    <div
      :class="[
        'pg-flex',
        'pg-flex-col',
        'pg-mx-auto',
        'pg-max-w-[768px]',
        'pg-px-4',
        'lg:pg-max-w-[1300px]',
      ]"
    >
      <div class="pg-my-6">
        <BackButton @click="handleGoBack" />
      </div>

      <!-- CONTENT -->
      <div
        :class="[
          'pg-grid',
          'pg-grid-cols-1',
          'lg:pg-grid-cols-12',
          'lg:pg-gap-12',
        ]"
      >
        <!-- LEFT -->
        <div class="pg-col-span-full lg:pg-col-span-5 pg-order-2 lg:pg-order-1">
          <img
            src="@/assets/png/play-learn/child-with-backpack.png"
            class="pg-w-full"
          >
        </div>

        <!-- RIGHT -->
        <div
          :class="[
            'pg-col-span-full',
            'pg-flex',
            'pg-flex-col',
            'pg-justify-center',
            'pg-order-1',
            'lg:pg-col-span-7',
            'lg:pg-mt-14',
            'lg:pg-order-2',
          ]"
        >
          <ShortRegisterForm
            :loading="isLoading"
            @click:submit="handleSubmit"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, useContext, useRouter, useStore } from '@nuxtjs/composition-api'
import BackButton from '@/components/app/learn-play/BackButton/BackButton.vue'
import ShortRegisterForm from '@/components/forms/children/ShortRegisterForm.vue'
import { useAuth, useChild, usePayment, useSnotifyHelper } from '@/composables'
import { CardData, Child, DataSubscription, TypedStore } from '@/models'

export default defineComponent({
  name: 'AppPlayLearnChildren',

  layout: 'play-learn',

  components: {
    BackButton,
    ShortRegisterForm
  },

  setup() {
    const snotify = useSnotifyHelper()
    const store = useStore<TypedStore>()
    const router = useRouter()
    const Auth = useAuth({ store })
    const Child = useChild({ store })

    const isLoading = ref(false)
    const toggleInfo = ref(true)

    async function handleSubmit(children: Child[]) {
      try {
        isLoading.value = true

        await Promise.all(
          children.map((child) => {
            return child.id
              ? Child.update(child.id, child)
              : Child.create(child)
          })
        )

        await Auth.fetchUserInfo()
        snotify.success('Child information has been saved!')
        goToNextStep()
      } catch {
        snotify.error('Something went wrong. Please try again.')
      } finally {
        isLoading.value = false
      }
    }

    function handleGoBack() {
      router.push({
        name: 'app-play-learn-payment',
        query: {
          step: '2',
          process: 'signup'
        }
      })
    }

    function goToNextStep() {
      router.push({
        name: 'app-learn-play'
      })
    }

    return {
      isLoading,
      toggleInfo,
      handleSubmit,
      handleGoBack
    }
  }
})
</script>
