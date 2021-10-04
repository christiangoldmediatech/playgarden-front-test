<template>
  <div>
    <v-dialog
      v-model="isModalVisible"
      :width="$vuetify.breakpoint.mdAndUp? '80vw': '90vw'"
    >
      <div class="wrapper">
        <aside v-if="$vuetify.breakpoint.mdAndUp">
          <img
            :src="require('@/assets/images/users/trialExpiredImage.jpeg')"
            alt="Kid image"
          >
        </aside>
        <main class="pa-3 py-7">
          <section class="fs-14 pg-grey--text">
            <h1 class="underlined-title fw-800 mb-2">
              Your trial period has expired
            </h1>
            <p>
              We hope your little one has enjoyed learning with the Playgarden Prep teachers!
            </p>
            <p>
              During your trial period, which ended on <span> {{ formattedTrialExpiryDate }} </span>,
              you were able to experience all the features of the
              <a>Preschool @Home </a> plan. After the trial period, you will be automatically placed in the
              <a>Learn & Play</a> monthly plan.
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
              <span> Need help? </span> <a> Contact us </a>
            </div>
          </section>
          <section>
            <div class="my-4 cta-buttons">
              <v-btn color="accent">
                Upgrade to Preschool @ Home
              </v-btn>
              <v-btn
                color="accent"
                outlined
              >
                Compare Plans
              </v-btn>
            </div>
            <div class="primary--text text-decoration-underline fw-500">
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
import { computed, defineComponent, ref, useStore } from '@nuxtjs/composition-api'
import { TypedStore } from '@/models'
import dayjs from 'dayjs'
import isToday from 'dayjs/plugin/isToday'
dayjs.extend(isToday)

export default defineComponent({
  name: 'SubscriptionEndDialog',
  setup () {
    const store = useStore<TypedStore>()
    const isModalVisible = ref(true)

    const { userInfo } = useStoreForAuth({ store })

    const isUserInLastDayOfTrial = computed(() => {
      if (!userInfo.value?.trialEnd) { return false }
      return dayjs(userInfo.value?.trialEnd).isToday()
    })

    const formattedTrialExpiryDate = computed(() => {
      return dayjs(userInfo.value?.trialEnd).format('DD/MM/YYYY')
    })

    return {
      userInfo,
      isUserInLastDayOfTrial,
      formattedTrialExpiryDate,
      isModalVisible
    }
  }
})
</script>

<style lang="scss" scoped>
.wrapper {
  display: grid;
  grid-auto-flow: column;
  background-color: white;

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

  .cta-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }
}

.underlined-title {
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
}
</style>
