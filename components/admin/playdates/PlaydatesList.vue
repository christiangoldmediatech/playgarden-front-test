<template>
  <v-col class="fill-height">
    <!-- ACTIVE PLAYDATES -->
    <div>
      <v-row align="center" class="fill-height" justify="space-between" no-gutters>
        <v-col cols="12" order="3">
          <!-- WEEK NAVIGATOR -->
          <div class="d-flex justify-center align-center">
            <!-- PREVIOUS WEEK BUTTON -->
            <v-btn
              :disabled="!canGoToPreviousWeek"
              :small="isMobile"
              icon
              color="accent"
              class="mx-6 nav-button"
              @click="goToPreviousWeek"
            >
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>

            <!-- WEEK INFO -->
            <span class="text-body-2 text-md-h5 font-weight-medium">{{ currentWeekDisplayText }}</span>

            <!-- NEXT WEEK BUTTON -->
            <v-btn
              :disabled="!canGoToNextWeek"
              :small="isMobile"
              icon
              color="accent"
              class="mx-6 nav-button"
              @click="goToNextWeek"
            >
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </div>

          <!-- WEEK'S PLAYDATES -->
          <v-row v-if="!loading" class="mt-6">
            <v-col v-for="playdate in playdates" :key="playdate.id" cols="12" md="6">
              <card-playdate
                :playdate="playdate"
                :manangement="true"
                :is-in-a-playdate="isInAPlaydate"
                @spot-reserved="fetchPlaydatesForDate"
                @spot-canceled="fetchPlaydatesForDate"
              />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </div>
  </v-col>
</template>

<script lang="ts">
import { computed, defineComponent, ref, useStore, watch } from '@nuxtjs/composition-api'
import { Playdate, TypedStore } from '@/models'

import CardPlaydate from '@/components/app/playdates/CardPlaydate.vue'
import { useChild, usePlaydates, useVuetifyHelper } from '@/composables'
import dayjs from 'dayjs'

export default defineComponent({
  name: 'PlaydatesList',

  components: {
    CardPlaydate,
    Paywall: () => import('@/components/app/playdates/Paywall.vue')
  },

  setup () {
    const MIN_WEEK_INDEX = 0
    const MAX_WEEK_INDEX = 2

    const vuetify = useVuetifyHelper()
    const store = useStore<TypedStore>()
    const { isPayingUser, getPlaydateForDate, getPlaydatesDates } = usePlaydates({ store })
    const { children, get } = useChild({ store })

    const playdatesDates = getPlaydatesDates()
    const currentPlaydateIndex = ref(0)
    const loading = ref(false)
    const playdates = ref<Playdate[]>([])
    const currentPlaydateDate = computed(() => playdatesDates?.[currentPlaydateIndex.value] || dayjs().format('YYYY-MM-DD'))
    const isMobile = computed(() => vuetify.breakpoint.mobile)

    const isInAPlaydate = computed(() => {
      return playdates.value.some((playdate) => {
        return Boolean(playdate?.backpackImages?.find(({ childrenId }) => {
          return children.value.find(({ id }) => id === childrenId)
        }))
      })
    })

    const currentWeekDisplayText = computed(() => {
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
      loading.value = true
      playdates.value = await getPlaydateForDate({ date: currentPlaydateDate.value })
      loading.value = false
    }

    watch(currentPlaydateIndex, async () => {
      await fetchPlaydatesForDate()
    }, { immediate: true })

    return {
      canGoToNextWeek,
      canGoToPreviousWeek,
      currentWeekDisplayText,
      isInAPlaydate,
      isMobile,
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
