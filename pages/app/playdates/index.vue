<template>
  <pg-loading :loading="loading" fullscreen>
    <v-col class="fill-height" data-test-id="playdates-content">
      <!-- ACTIVE PLAYDATES -->
      <div v-if="isPayingUser && !hasPlayAndLearnPlan">
        <v-row
          align="center"
          class="fill-height"
          justify="space-between"
          no-gutters
        >
          <!-- HEADER -->
          <v-col cols="12" md="auto" class="flex-grow-1" order="2" order-md="1">
            <underlined-title
              text="Educational Playdates"
              font-size="36px"
              font-size-mobile="24px"
            />
          </v-col>

          <!-- BUTTON -->
          <v-col
            cols="12"
            md="auto"
            class="flex-shrink-1 text-right py-6 py-md-0"
            order="1"
            order-md="2"
          >
            <v-btn
              :to="{ name: 'app-playdates-my-playdates' }"
              :small="isMobile"
              color="accent"
              nuxt
              class="!pg-shadow-button"
            >
              MY PLAYDATES
            </v-btn>
          </v-col>

          <v-col cols="12" order="3">
            <!-- PAGE DESCRIPTION -->
            <p class="text-body-2 text-md-body-1 py-4">
              Join your friends and socialize at a Playgarden Prep Online
              Playdate! These 30 minute Zoom sessions are designed to give
              children the opportunity to connect with peers while learning
              under the guidance of a Playgarden Prep instructor. You can sign
              up for up to one Playdate per week; make sure to sign up for the
              same weekly Playdate, so that you can see your friends every week!
            </p>

            <!-- WEEK NAVIGATOR -->
            <div class="d-flex justify-center align-center">
              <week-selector
                :day="day"
                @prev-week="removeWeek"
                @next-week="addWeek"
              />
            </div>

            <!-- THANKSGIVING -->
            <v-row v-if="isThanksgivingWeek" class="mt-6">
              <v-col cols="12" class="text-center">
                <div>
                  <underlined-title
                    text="Happy Thanksgiving ✨"
                    font-size="32px"
                    font-size-mobile="24px"
                    line-color="#ffab37"
                  />
                </div>

                <div class="mt-4">
                  <p class="text-body-2 text-md-body-1 py-4">
                    We are not having Playdates this week, you can reserve your
                    spot for the following weeks!
                  </p>
                </div>

                <v-btn
                  v-if="canGoToNextWeek"
                  color="accent"
                  large
                  class="text-none !pg-shadow-button mt-6"
                  @click="goToNextWeek"
                >
                  Check next week
                </v-btn>
              </v-col>
            </v-row>

            <!-- WEEK'S PLAYDATES -->
            <v-row v-else-if="playdates.length" class="mt-6">
              <v-col
                v-for="playdate in playdates"
                :key="playdate.id"
                cols="12"
                md="6"
              >
                <card-playdate
                  :playdate="playdate"
                  :is-in-a-playdate="isInAPlaydate"
                  @spot-reserved="fetchPlaydatesForDate"
                  @spot-canceled="fetchPlaydatesForDate"
                />
              </v-col>
            </v-row>

            <!--  NO PLAYDATES -->
            <v-row v-else class="mt-6">
              <v-col cols="12" class="text-center">
                <div>
                  <underlined-title
                    text="There aren't any playdates for this week."
                    font-size="32px"
                    font-size-mobile="24px"
                    line-color="#ffab37"
                  />
                </div>

                <v-btn
                  v-if="canGoToNextWeek"
                  color="accent"
                  large
                  class="text-none !pg-shadow-button mt-6"
                  @click="goToNextWeek"
                >
                  Check next week
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </div>

      <!-- PAYWALL -->
      <paywall v-else />
    </v-col>
  </pg-loading>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  ref,
  useStore,
  watch
} from '@nuxtjs/composition-api'
import { Playdate, TypedStore } from '@/models'
import WeekSelector from '@/components/app/live-sessions/WeekSelector.vue'
import CardPlaydate from '@/components/app/playdates/CardPlaydate.vue'
import { useChild, usePlaydates, useVuetifyHelper } from '@/composables'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import { onMounted } from '@vue/composition-api'
import { getMondayFriday } from '@/utils/dateTools'

dayjs.extend(isBetween)

export default defineComponent({
  name: 'Index',

  components: {
    CardPlaydate,
    WeekSelector,
    Paywall: () => import('@/components/app/playdates/Paywall.vue')
  },

  setup() {
    const MIN_WEEK_INDEX = 0
    const MAX_WEEK_INDEX = 2

    const vuetify = useVuetifyHelper()
    const store = useStore<TypedStore>()
    const {
      isPayingUser,
      getPlaydateForDate,
      getPlaydatesDates,
      getPlaydateWithChildren
    } = usePlaydates({ store })
    const { children, get } = useChild({ store })
    const day = ref(new Date())
    const playdatesDates = getPlaydatesDates()
    const currentPlaydateIndex = ref(0)
    const loading = ref(false)
    const playdates = ref<Playdate[]>([])
    const currentPlaydateDate = computed(
      () =>
        playdatesDates?.[currentPlaydateIndex.value] ||
        dayjs().format('YYYY-MM-DD')
    )
    const isMobile = computed(() => vuetify.breakpoint.mobile)

    const hasPlayAndLearnPlan = computed(() => {
      return store.getters['auth/hasPlayAndLearnPlan']
    })

    const isThanksgivingWeek = computed(() => {
      const thanksGivingDay = '2021-11-25'

      // @ts-ignore
      return dayjs(currentPlaydateDate.value).isBetween(
        dayjs(thanksGivingDay).startOf('week'),
        dayjs(thanksGivingDay).endOf('week'),
        'day',
        '[]'
      )
    })

    const days = computed(() => {
      return getMondayFriday(day.value)
    })

    const isInAPlaydate = computed(() => {
      return playdates.value.some((playdate) => {
        return Boolean(
          playdate?.backpackImages?.find(({ childrenId }) => {
            return children.value.find(({ id }) => id === childrenId)
          })
        )
      })
    })

    const currentWeekDisplayText = computed(() => {
      if (isThanksgivingWeek.value) {
        return 'November 22 - 26, 2021'
      }

      if (playdates.value.length === 0) {
        return ''
      }

      const startDate = playdates.value?.[0]?.date
      const endDate = playdates.value?.[playdates.value.length - 1]?.date

      const isSameMonth = dayjs(startDate).month() === dayjs(endDate).month()
      // e.g. October 24
      let displayDate = dayjs(startDate).format('MMMM DD')
      // e.g. October 24 - 30 or October 31 - November 6
      displayDate += isSameMonth
        ? ` - ${dayjs(endDate).format('DD')}`
        : ` - ${dayjs(endDate).format('MMMM DD')}`
      // e.g. October 24 - 30, 2021
      displayDate += `, ${dayjs(startDate).format('YYYY')}`

      return displayDate
    })

    const canGoToPreviousWeek = computed(
      () => currentPlaydateIndex.value > MIN_WEEK_INDEX
    )
    const canGoToNextWeek = computed(
      () => currentPlaydateIndex.value < MAX_WEEK_INDEX
    )

    const goToPreviousWeek = () => {
      if (canGoToPreviousWeek.value) {
        currentPlaydateIndex.value--
      }
    }

    const goToNextWeek = () => {
      if (canGoToNextWeek.value) {
        currentPlaydateIndex.value++
      }
    }

    const addWeek = async () => {
      day.value.setDate(day.value.getDate() + 7)
      day.value = new Date(day.value)
      await fetchPlaydatesForDate()
    }

    const removeWeek = async () => {
      day.value.setDate(day.value.getDate() - 7)
      day.value = new Date(day.value)
      await fetchPlaydatesForDate()
    }

    const fetchPlaydatesForDate = async () => {
      if (isPayingUser.value) {
        loading.value = true
        playdates.value = await getPlaydateWithChildren({
          startDate: days.value.monday,
          endDate: days.value.friday,
          admin: true,
          type: 'Playdate',
          page: 1,
          limit: 100
        })
        loading.value = false
      }
    }

    watch(
      currentPlaydateIndex,
      async () => {
        await fetchPlaydatesForDate()
      },
      { immediate: true }
    )

    onMounted(() => {
      get()
    })

    return {
      canGoToNextWeek,
      canGoToPreviousWeek,
      currentWeekDisplayText,
      isInAPlaydate,
      isMobile,
      isPayingUser,
      loading,
      playdates,
      isThanksgivingWeek,
      fetchPlaydatesForDate,
      day,
      addWeek,
      removeWeek,
      goToNextWeek,
      goToPreviousWeek,
      hasPlayAndLearnPlan
    }
  }
})
</script>

<style lang="scss" scoped>
.nav-button {
  background: #ffffff;
  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.15) !important;
}
</style>
