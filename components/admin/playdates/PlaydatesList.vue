<template>
  <v-col class="fill-height">
    <!-- ACTIVE PLAYDATES -->
    <div>
      <v-row align="center" class="fill-height" justify="space-between" no-gutters>
        <v-col cols="12" order="3">
          <!-- WEEK NAVIGATOR -->
          <div class="d-flex justify-center align-center">
            <week-selector :day="day" :loading="loading" @prev-week="removeWeek" @next-week="addWeek" />
          </div>

          <!-- WEEK'S PLAYDATES -->
          <v-row v-if="!loading" class="mt-6">
            <v-col v-for="playdate in playdates" :key="playdate.id" cols="12" md="6">
              <card-playdate
                :playdate="playdate"
                :manangement="true"
                :is-in-a-playdate="isInAPlaydate"
              />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </div>
  </v-col>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, useStore } from '@nuxtjs/composition-api'
import { Playdate, TypedStore } from '@/models'
import WeekSelector from '@/components/admin/live-sessions/WeekSelector.vue'
import CardPlaydate from '@/components/app/playdates/CardPlaydate.vue'
import { useChild, usePlaydates, useVuetifyHelper } from '@/composables'
import { getMondayFriday } from '@/utils/dateTools'

export default defineComponent({
  name: 'PlaydatesList',

  components: {
    CardPlaydate,
    WeekSelector,
    Paywall: () => import('@/components/app/playdates/Paywall.vue')
  },

  setup () {
    const vuetify = useVuetifyHelper()
    const store = useStore<TypedStore>()
    const { isPayingUser, getPlaydateWithChildren } = usePlaydates({ store })
    const { children } = useChild({ store })
    const loading = ref(false)
    const day = ref(new Date())
    const playdates = ref<Playdate[]>([])
    const isMobile = computed(() => vuetify.breakpoint.mobile)

    const isInAPlaydate = computed(() => {
      return playdates.value.some((playdate) => {
        return Boolean(playdate?.backpackImages?.find(({ childrenId }) => {
          return children.value.find(({ id }) => id === childrenId)
        }))
      })
    })

    const days = computed(() => {
      return getMondayFriday(day.value)
    })

    const addWeek = async () => {
      day.value.setDate(day.value.getDate() + 7)
      day.value = new Date(day.value)
      await getPlaydateBetweenDate()
    }

    const removeWeek = async () => {
      day.value.setDate(day.value.getDate() - 7)
      day.value = new Date(day.value)
      await getPlaydateBetweenDate()
    }

    const getPlaydateBetweenDate = async () => {
      loading.value = true
      playdates.value = await getPlaydateWithChildren({ startDate: days.value.monday, endDate: days.value.friday, type: 'Playdate', page: 1, limit: 100 })
      loading.value = false
    }

    onMounted(async () => {
      await getPlaydateBetweenDate()
    })

    return {
      day,
      isInAPlaydate,
      isMobile,
      isPayingUser,
      loading,
      playdates,
      addWeek,
      removeWeek,
      getPlaydateBetweenDate
    }
  },
  created () {
    this.$nuxt.$on('update-calendar', async () => {
      await this.getPlaydateBetweenDate()
    })
  },

  beforeDestroy () {
    this.$nuxt.$off('update-calendar')
  }
})
</script>

<style lang="scss" scoped>
.nav-button {
  background: #FFFFFF;
  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.15) !important;
}
</style>
