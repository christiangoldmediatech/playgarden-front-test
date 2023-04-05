<template>
  <PgDialog
    v-model="dialog"
    content-class="!pg-shadow-none"
    :fullscreen="$vuetify.breakpoint.smAndDown"
    width="850"
    persistent
  >
    <div
      :class="[
        'pg-bg-white',
        'md:pg-flex',
        'md:pg-rounded-[66px]',
        'pg-relative',
        'pg-h-full',
        'pg-px-8',
        'md:pg-px-0',
        'md:pg-min-h-[300px]'
      ]"
    >
      <!-- Side image -->
      <img
        v-if="$vuetify.breakpoint.mdAndUp"
        :src="require('assets/png/online-preschool-no-cc.png')"
        alt="Kid playing"
        class="pg-rounded-[0_66px_66px_0] pg-w-[300px]"
      />

      <!-- Content -->
      <div
        :class="[
          'pg-relative',
          'pg-flex',
          'pg-flex-col',
          'pg-gap-2',
          'pg-justify-center',
          'pg-items-center',
          'pg-h-full',
          'md:pg-h-auto',
          'pg-mx-auto',
          'md:pg-mx-10'
        ]"
      >
        <p class="pg-text-center pg-leading-6">
          Your free trial for the
          <span class="pg-font-semibold">Online Preschool</span> plan has come
          to an end. As a special gift, we've decided to extend your trial. You
          can now trial our
          <span class="pg-font-semibold">Play &amp; Learn plan</span> for an
          additional
          <span class="pg-font-semibold">
            15 days FREE!
          </span>
        </p>

        <!-- Actions -->
        <div class="pg-flex pg-flex-col pg-gap-3 pg-text-center">
          <PgButton
            color="primary"
            :loading="loading"
            @click="handleAcceptButtonClick"
          >
            START LEARNING WITH PLAY AND LEARN
          </PgButton>

          <span class="pg-text-sm">
            Still want to cancel? Click here to go to your
            <UnderlinedLink text="Account Page." @click="goToAccounts" />
          </span>
        </div>
      </div>
    </div>
  </PgDialog>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  useRouter,
  ref,
  useStore
} from '@nuxtjs/composition-api'
import PgButton from '@/components/pg/components/PgBtn.vue'
import UnderlinedLink from '@/components/shared/UnderlinedLink/UnderlinedLink.vue'
import { PlanTier, TypedStore } from '@/models'
import {
  useAuth,
  useNotification,
  useNuxtHelper,
  useToastHelper
} from '@/composables'

export default defineComponent({
  name: 'NoCreditCardFreeTrialEndedDialog',
  components: {
    UnderlinedLink,
    PgButton
  },
  props: {
    value: {
      type: Boolean,
      required: true
    }
  },
  emits: ['input'],
  setup(props, { emit }) {
    const dialog = computed({
      get(): boolean {
        return props.value
      },
      set(value: boolean) {
        emit('input', value)
      }
    })

    function close() {
      dialog.value = false
    }

    const loading = ref(false)

    const store = useStore<TypedStore>()
    const nuxt = useNuxtHelper()
    const toast = useToastHelper()

    const Auth = useAuth({ store })
    const Notifications = useNotification({ store })

    async function handleAcceptButtonClick() {
      try {
        loading.value = true

        const plan = {
          id: PlanTier.PLAY_AND_LEARN,
          type: 'monthly',
          fromPlaydates: false,
          trial: true
        }

        await store.dispatch('payment/selectSubscriptionPlan', plan)
        await Auth.fetchUserInfo()
        Notifications.setIsTrialEndingPlanSelectedModalVisible(true)
        nuxt.$emit('plan-membership-changed')
      } catch (e) {
        toast.error('Could not select plan. Please try again later.')
      } finally {
        loading.value = false
      }
    }

    const router = useRouter()
    async function goToAccounts() {
      await router.push({ name: 'app-account-membership' })
      close()
    }

    return {
      dialog,
      loading,
      close,
      handleAcceptButtonClick,
      goToAccounts
    }
  }
})
</script>
