<template>
  <div>
    <large-image-content-dialog
      :value="isModalVisible"
      :img="img"
      :is-closeable="canDismissModal"
      @close="closeModal"
    >
      <div>
        <underlined-title
          text="Your trial period has expired"
          font-size="32px"
          font-size-mobile="22px"
          letter-spacing="4.8px"
        />
      </div>

      <div class="grey--text text--darken-2 caption text-md-h6 font-weight-regular my-3 my-md-6">
        <p>
          We hope your little one has enjoyed learning with the Playgarden Prep teachers!
        </p>

        <p>
          During your trial period, which ended on
          <span class="trialExpiryDate secondary--text fw-600 fs-18"> {{ formattedTrialExpiryDate }} </span>,
          you were able to experience all the features of the
          <span class="accent--text fw-600">Preschool @Home </span> plan. After the trial period, you will be automatically placed in the
          <span class="accent--text fw-600">Learn & Play</span> monthly plan.
          you liked what you had until now please upgrade to the Preschool @ Home.
        </p>

        <p>
          As always, you cancel your enrollment anytime by going to your Accounts Page.
          Please contact us with any questions about the plans, your enrollment,
          or anything at all related to Playgarden Prep.
        </p>

        <p>
          With kind regards, </br>
          Playgarden Prep Teachers.
        </p>
      </div>

      <v-row no-gutters class="text-center text-md-left">
        <v-col cols="12" md="auto" class="my-4">
          <v-btn
            :x-large="!isMobile"
            :small="isMobile"
            class="text-none !pg-shadow-button"
            color="accent"
            @click="handleRequestToUpgradeToPreSchool"
          >
            Upgrade to PRESCHOOL @ HOME
          </v-btn>
        </v-col>

        <v-col cols="12" md="auto" class="mx-0 mx-md-4 align-self-center font-weight-bold">
          <v-btn
            :x-large="!isMobile"
            :small="isMobile"
            color="accent"
            class="text-none"
            outlined
            @click="handleRequestToComparePlans"
          >
            Compare Plans
          </v-btn>
        </v-col>

        <v-col cols="12" class="mx-0 mx-md-4 mt-4 mt-md-0 align-self-center font-weight-bold">
          <span class="text-decoration-underline" @click="handleKeepCurrentPlans">
            <a class="accent--text">I want to keep my current plan</a>
          </span>
        </v-col>
      </v-row>
    </large-image-content-dialog>
  </div>
</template>

<script lang="ts">
import { useNotification, useStoreForAuth, useVuetifyHelper } from '@/composables'
import { computed, defineComponent, onMounted, ref, useRouter, useStore, WritableComputedRef } from '@nuxtjs/composition-api'
import { TypedStore } from '@/models'
import { hasLocalStorage } from '@/utils/window'
import dayjs from 'dayjs'
import LargeImageContentDialog from '@/components/ui/dialogs/LargeImageContentDialog/LargeImageContentDialog.vue'
import isToday from 'dayjs/plugin/isToday'
dayjs.extend(isToday)

interface TrialNotificationPreference {
  silencedAt: Date | undefined;
}

const LS_KEY_FOR_TRIAL_NOTIFICATION_PREFERENCE = 'trialExpiryNotificationData'
const NUMBER_OF_HOURS_TO_SILENCE_NOTIFICATION = 24

export default defineComponent({
  name: 'TrialEndingModalForLastDay',

  components: {
    LargeImageContentDialog
  },

  props: {
    downwardDisplacement: {
      type: Number,
      required: false
    }
  },

  data() {
    return {
      img: require('@/assets/images/users/trialExpiredImage.jpeg')
    }
  },

  setup (props) {
    const store = useStore<TypedStore>()
    const vuetify = useVuetifyHelper()
    const notification = useNotification({ store })
    const router = useRouter()
    const { userInfo } = useStoreForAuth({ store })
    const trialNotificationPreference = ref<TrialNotificationPreference | undefined>()

    onMounted(() => {
      fetchNotificationPreferenceFromLS()
    })

    const isCurrenltyInSilentWindow = computed(() => {
      const preferenceLastUpdatedAt = trialNotificationPreference.value?.silencedAt
      if (preferenceLastUpdatedAt) {
        const windowEndDate = dayjs(preferenceLastUpdatedAt).add(NUMBER_OF_HOURS_TO_SILENCE_NOTIFICATION, 'h')
        return dayjs().isBefore(windowEndDate)
      }
      return Boolean(trialNotificationPreference.value) // The default is taken as true rather than false to prevent flashing of modal and disappering quickly.
    })

    // The user can not dismiss the modal 5 days past the user's trial_end date.
    const canDismissModal = computed(() => {
      if (!userInfo.value?.trialEnd) { return false }
      return dayjs(userInfo.value?.trialEnd).add(5, 'd').isAfter(dayjs())
    })

    const isModalVisible: WritableComputedRef<boolean> = computed({
      get (): boolean {
        return notification.isTrialEndingForLastDayModalVisible.value
      },
      set (newValue: boolean): void {
        notification.setIsTrialEndingForLastDayModalVisible(newValue)

        if (newValue === false) {
          saveNotificationPreference()
          fetchNotificationPreferenceFromLS()
        }
      }
    })

    const isMobile = computed(() => vuetify.breakpoint.mobile)

    const formattedTrialExpiryDate = computed(() => {
      return dayjs(userInfo.value?.trialEnd).format('MMM D, YYYY')
    })

    const customDialogStyle = computed(() => {
      if (!props.downwardDisplacement) { return {} }
      return {
        'margin-top': `${props.downwardDisplacement}px`
      }
    })

    function fetchNotificationPreferenceFromLS () {
      if (hasLocalStorage()) {
        const LSValueString = window.localStorage.getItem(LS_KEY_FOR_TRIAL_NOTIFICATION_PREFERENCE)
        if (LSValueString) {
          trialNotificationPreference.value = JSON.parse(LSValueString)
        }
      }
    }

    function saveNotificationPreference () {
      const notificationPreference: TrialNotificationPreference = {
        silencedAt: new Date()
      }
      if (process.client) {
        window.localStorage.setItem(LS_KEY_FOR_TRIAL_NOTIFICATION_PREFERENCE, JSON.stringify(notificationPreference))
      }
    }

    function handleRequestToContact () {
      closeModal()
    }

    function handleRequestToRemindLater () {
      closeModal()
    }

    function handleDialogCloseRequest () {
      closeModal()
    }
    function closeModal () {
      isModalVisible.value = false
    }

    function handleRequestToUpgradeToPreSchool () {
      closeModal()
      notification.setIsPlanUpgradeModalVisible(true)
    }

    function handleRequestToComparePlans () {
      closeModal()
      router.push({
        name: 'app-payment-plan'
      })
    }

    function handleKeepCurrentPlans () {
      // to be implemented when completing the workflow
    }

    return {
      canDismissModal,
      formattedTrialExpiryDate,
      isMobile,
      isModalVisible,
      customDialogStyle,
      closeModal,
      handleDialogCloseRequest,
      handleRequestToComparePlans,
      handleRequestToContact,
      handleRequestToRemindLater,
      handleRequestToUpgradeToPreSchool,
      handleKeepCurrentPlans
    }
  }
})
</script>

<style lang="scss" scoped>
.opacity-50 {
  opacity: 0.5;
}

.trialExpiryDate {
  z-index: 2;
  position: relative;
  width: max-content;
  font-size: 20px;
  text-transform: uppercase;
  color: #707070;
  word-wrap: break-word;
  white-space: normal;

  &:after {
    content: ' ';
    display: block;
    width: 100%;
    position: absolute;
    bottom: 4px;
    z-index: -1;
    height: 5px;
    background: #b2e68d;
    border-radius: 32px;
  }

  @media (max-width: $breakpoint-xs) {
    font-size: 16px;

    &:after {
      bottom: 3px;
      height: 4px;
    }
  }
}

.trialExpiryDate {
  display: inline-block;
  text-transform: none;

  &:after {
    background: rgba(178, 230, 141, 0.25);
    height: 6px;
  }
}
</style>
