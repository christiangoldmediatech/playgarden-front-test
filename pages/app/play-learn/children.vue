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
        <BackButton v-if="!hideBackButton" @click="handleGoBack" />
      </div>

      <!-- CONTENT -->
      <v-container class="pa-0" :style="{ 'height': this.$vuetify.breakpoint.lgAndUp ? '650px' : 'unset' }" fluid>
        <v-row class="fill-height content-wrapper" no-gutters>
          <!-- LEFT -->
          <v-col cols="12" lg="5" class="fill-height">
            <img
              src="@/assets/png/play-learn/child-with-backpack.png"
              class="backpack-img pg-w-full content-border"
              height="100%"
            >
          </v-col>

          <v-col cols="12" lg="7" class="fill-height">
            <!-- RIGHT -->
            <div class="form-wrapper fill-height">
              <div class="form-container pt-8 content-border" :class="{ 'px-12': this.$vuetify.breakpoint.lgAndUp }">
                <ShortRegisterForm
                  :loading="isLoading"
                  @click:submit="handleSubmit"
                />
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, useRouter, useStore, computed } from '@nuxtjs/composition-api'
import BackButton from '@/components/shared/BackButton/BackButton.vue'
import ShortRegisterForm from '@/components/forms/children/ShortRegisterForm.vue'
import { useAuth, useChild, useSnotifyHelper } from '@/composables'
import { Child, TypedStore } from '@/models'
import { Flow } from '@/composables/users/enums'

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

    const hideBackButton = computed(() => store.getters['auth/getUserInfo'].flow === Flow.NOCREDITCARD)

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
        name: 'app-pick-child'
      })
    }

    return {
      isLoading,
      toggleInfo,
      handleSubmit,
      handleGoBack,
      hideBackButton
    }
  }
})
</script>

<style lang="scss" scoped>
.container {
  height: 650px;
}

.content-wrapper {
  display: flex;
}

.content-border {
  border-radius: 18px;
}

.form-container {
  height: 100%;
  width: 100%;
  background: white;

  @media (min-width: 1264px) {
    position: absolute;
    left: -90px;
    width: calc(100% + 90px);
    box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.15);
  }
}

.backpack-img {
  height: 200px;
  object-position: 100% 0;
  object-fit: cover;

  @media (min-width: 600px) {
    height: 500px;
    object-position: 100% 0;
  }

  @media (min-width: 1264px) {
    height: 100%;
  }
}

.form-wrapper {
  position: relative;
}
</style>
