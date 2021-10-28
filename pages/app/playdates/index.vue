<template>
  <v-col class="fill-height">
    <!-- ACTIVE PLAYDATES -->
    <div v-if="isPayingUser">
      <v-row align="center" class="fill-height" justify="space-between">
        <!-- HEADER -->
        <v-col cols="12" md="auto" class="flex-grow-1">
          <underlined-title
            text="Educational Playdates"
            font-size="36px"
          />
        </v-col>

        <!-- BUTTON -->
        <v-col cols="12" md="auto" class="flex-shrink-1">
          <v-btn color="accent">
            MY PLAYDATES
          </v-btn>
        </v-col>

        <v-container>
          <!-- PAGE DESCRIPTION -->
          <p class="body-1">
            Join your friends and socialize at a Playgarden Prep Online Playdate!
            These 30 minute Zoom sessions are designed to give children the opportunity to connect with peers while learning under the guidance of a Playgarden Prep instructor.
            You can sign up for up to one Playdate per week; make sure to sign up for the same weekly Playdate, so that you can see your friends every week!
          </p>

          <!-- WEEK NAVIGATOR -->
          <div class="d-flex justify-center align-center">
            <!-- PREVIOUS WEEK BUTTON -->
            <v-btn :disabled="!canGoToPreviousWeek" icon color="accent" class="mx-6 nav-button" @click="goToPreviousWeek">
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>

            <!-- WEEK INFO -->
            <span class="text-h5">{{ currentWeekDisplayText }}</span>

            <!-- NEXT WEEK BUTTON -->
            <v-btn :disabled="!canGoToNextWeek" icon color="accent" class="mx-6 nav-button" @click="goToNextWeek">
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </div>

          <!-- WEEK'S PLAYDATES -->
          <v-row v-if="!loading" class="mt-6">
            <v-col v-for="playdate in playdates" :key="playdate.id" cols="12" md="6">
              <card-playdate
                :playdate="playdate"
                :is-in-a-playdate="isInAPlaydate"
                @spot-reserved="fetchPlaydatesForDate"
                @spot-canceled="fetchPlaydatesForDate"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-row>
    </div>

    <!-- PAYWALL -->
    <paywall v-else />
  </v-col>
</template>

<script lang="ts">
import { computed, defineComponent, ref, useStore, watch } from '@nuxtjs/composition-api'
import { Child, Playdate, TypedStore } from '@/models'

import CardPlaydate from '@/components/app/playdates/CardPlaydate.vue'
import { usePlaydates } from '@/composables'
import dayjs from 'dayjs'

export default defineComponent({
  name: 'Index',

  components: {
    CardPlaydate,
    Paywall: () => import('@/components/app/playdates/Paywall.vue')
  },

  setup () {
    const MIN_WEEK_INDEX = 0
    const MAX_WEEK_INDEX = 2

    const store = useStore<TypedStore>()
    const { isPayingUser, getPlaydateForDate, getPlaydatesDates } = usePlaydates({ store })

    const playdatesDates = getPlaydatesDates()
    const currentPlaydateIndex = ref(0)
    const loading = ref(false)
    const playdates = ref<Playdate[]>([])
    const children = computed<Child[]>(() => store.getters['children/rows'])
    const currentPlaydateDate = computed(() => playdatesDates?.[currentPlaydateIndex.value] || dayjs().format('YYYY-MM-DD'))

    const isInAPlaydate = computed(() => {
      return playdates.value.some((playdate) => {
        return Boolean(playdate?.backpackImages?.find(({ childrenId }) => {
          return children.value.find(({ id }) => id === childrenId)
        }))
      })
    })

    const currentWeekDisplayText = computed(() => {
      const startOfWeek = dayjs(currentPlaydateDate.value).startOf('week')
      const endOfWeek = dayjs(currentPlaydateDate.value).endOf('week')
      const isSameMonth = dayjs(startOfWeek).month() === dayjs(endOfWeek).month()
      // e.g. October 24
      let displayDate = dayjs(startOfWeek).format('MMMM DD')
      // e.g. October 24 - 30 or October 31 - November 6
      displayDate += isSameMonth
        ? ` - ${dayjs(endOfWeek).format('DD')}`
        : ` - ${dayjs(endOfWeek).format('MMMM DD')}`
      // e.g. October 24 - 30, 2021
      displayDate += `, ${dayjs(startOfWeek).format('YYYY')}`

      return displayDate
    })

    const canGoToPreviousWeek = computed(() => currentPlaydateIndex.value > MIN_WEEK_INDEX)
    const canGoToNextWeek = computed(() => currentPlaydateIndex.value < MAX_WEEK_INDEX)

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

    const fetchPlaydatesForDate = async () => {
      if (isPayingUser.value) {
        loading.value = true
        playdates.value = await getPlaydateForDate({ date: currentPlaydateDate.value })
        loading.value = false
      }
    }

    watch(currentPlaydateIndex, async () => {
      await fetchPlaydatesForDate()
    }, { immediate: true })

    return {
      canGoToNextWeek,
      canGoToPreviousWeek,
      currentWeekDisplayText,
      isInAPlaydate,
      isPayingUser,
      loading,
      playdates,
      playdatesDates,
      fetchPlaydatesForDate,
      goToNextWeek,
      goToPreviousWeek
    }
  }
})
</script>

<style lang="scss" scoped>
.nav-button {
  background: #FFFFFF;
  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.15) !important;
}
</style>
