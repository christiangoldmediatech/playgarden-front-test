<template>
  <div>
    <v-dialog
      v-model="isModalVisible"
      persistent
      :width="$vuetify.breakpoint.mdAndUp? '80vw': '95vw'"
      content-class="trialEndDialog"
    >
      <div
        class="wrapper"
        :style="customDialogStyle"
      >
        <v-btn
          v-if="canDismissModal"
          icon
          class="btn-close"
          dark
          @click="handleDialogCloseRequest"
        >
          <v-icon>
            mdi-close
          </v-icon>
        </v-btn>
        <aside v-if="$vuetify.breakpoint.mdAndUp">
          <img
            :src="require('@/assets/images/users/trialExpiredImage.jpeg')"
            alt="Kid image"
          >
        </aside>
        <main class="pa-3 py-7">
          <section class="fs-13 pg-grey--text">
            <h1 class="underlined-title fw-800 mb-2">
              Your trial period has expired
            </h1>
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
            <div>
              <span class="opacity-50"> Need help? </span>
              <span @click="handleRequestToContact">
                <nuxt-link
                  :to="{
                    name: 'help'
                  }"
                  class="accent--text text-decoration-underline fw-500"
                >
                  Contact us
                </nuxt-link>
              </span>
            </div>
          </section>
          <section class="cta">
            <div class="my-4 cta-buttons">
              <v-btn
                color="accent"
                @click="handleRequestToUpgradeToPreSchool"
              >
                Upgrade to PRESCHOOL @ HOME
              </v-btn>
              <v-btn
                color="accent"
                outlined
                @click="handleRequestToComparePlans"
              >
                Compare Plans
              </v-btn>
            </div>
            <div
              class="primary--text text-decoration-underline fw-500 cursor-pointer"
              @click="handleRequestToRemindLater"
            >
              Remind me later
            </div>
          </section>
        </main>
      </div>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { useStoreForAuth } from '@/composables'
import { computed, defineComponent, onMounted, ref, useStore, WritableComputedRef } from '@nuxtjs/composition-api'
import { TypedStore } from '@/models'
import { hasLocalStorage } from '@/utils/window'
import dayjs from 'dayjs'
import isToday from 'dayjs/plugin/isToday'
dayjs.extend(isToday)

interface TrialNotificationPreference {
  silencedAt: Date | undefined;
}

const LS_KEY_FOR_TRIAL_NOTIFICATION_PREFERENCE = 'trialExpiryNotificationData'
const NUMBER_OF_HOURS_TO_SILENCE_NOTIFICATION = 24

const IS_MODAL_ENABLED = false // This would be changed to true after the entire flow is completed.

export default defineComponent({
  name: 'TrialEndingModalForLastDay',
  props: {
    downwardDisplacement: {
      type: Number,
      required: false
    }
  },
  setup (props) {
    const store = useStore<TypedStore>()
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

    const isUserInLastDayOfTrial = computed(() => {
      if (!userInfo.value?.trialEnd) { return false }
      return dayjs(userInfo.value?.trialEnd).isToday()
    })

    // The user can not dismiss the modal 5 days past the user's trial_end date.
    const canDismissModal = computed(() => {
      if (!userInfo.value?.trialEnd) { return false }
      return dayjs(userInfo.value?.trialEnd).add(5, 'd').isAfter(dayjs())
    })

    const isModalVisible: WritableComputedRef<boolean> = computed({
      get (): boolean {
        return !isCurrenltyInSilentWindow.value && isUserInLastDayOfTrial.value && IS_MODAL_ENABLED
      },
      set (newValue: boolean): void {
        if (newValue === false) {
          saveNotificationPreference()
          fetchNotificationPreferenceFromLS()
        }
      }
    })

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
      // to be implemented when completing the workflow
    }

    function handleRequestToComparePlans () {
      // to be implemented when completing the workflow
    }

    return {
      canDismissModal,
      formattedTrialExpiryDate,
      isModalVisible,
      handleRequestToContact,
      handleRequestToRemindLater,
      handleDialogCloseRequest,
      handleRequestToUpgradeToPreSchool,
      handleRequestToComparePlans,
      customDialogStyle
    }
  }
})
</script>

<style lang="scss" scoped>
.wrapper {
  display: grid;
  grid-auto-flow: column;
  background-color: white;
  position: relative;

  .btn-close {
    position: absolute;
    top: -32px;
    right: 0px;
  }

  p {
    line-height: 1.5;
  }

  aside {
    overflow: hidden;
    border-radius: 8px 40px 40px 8px;
    width: 30vw;

    img {
      height: 50vh;
      object-fit: cover;
      display: block;
    }
  }

  .cta,
  .cta-buttons {
    @media (max-width: $breakpoint-xs) {
      display: grid;
      justify-items: center;
      justify-content: center;
    }
  }

  .cta-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;

    ::v-deep {
      .v-btn {
        text-transform: none;

        @media (max-width: $breakpoint-xs) {
          font-size: 12px;
        }
      }
    }
  }
}

.opacity-50 {
  opacity: 0.5;
}

.underlined-title,
.trialExpiryDate {
  z-index: 2;
  position: relative;
  width: max-content;
  font-size: 18px;
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

<style lang="scss">
.trialEndDialog {
  box-shadow: none;
}
</style>
