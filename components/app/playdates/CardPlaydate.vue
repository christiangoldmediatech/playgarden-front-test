<template>
  <div>
    <v-card
      class="mx-auto custom-card-border"
      max-width="100%"
      height="100%"
      data-test-id="card-playdate"
      tile
    >
      <!-- CARD CONTENT -->
      <v-row justify="center" class="pa-3 pa-sm-6" no-gutters>
        <!-- IMAGE ONLY ON DESKTOP -->
        <v-col md="5" class="d-none d-sm-block align-self-center">
          <v-row no-gutters>
            <v-col cols="4" md="12">
              <v-img
                alt="Educational Playdates"
                contain
                :max-height="500"
                :src="require('@/assets/png/playdates/playdate.png')"
              />
            </v-col>
          </v-row>
        </v-col>

        <!-- PLAYDATE INFO -->
        <v-col cols="12" md="7" class="pl-sm-3">
          <v-row no-gutters>
            <!-- IMAGE ONLY ON MOBILE -->
            <v-col cols="4" class="d-sm-none">
              <v-img
                alt="Educational Playdates"
                contain
                :max-height="500"
                :src="require('@/assets/png/playdates/playdate.png')"
              />
            </v-col>

            <!-- PLAYDATE SPECIALIST AND DATE -->
            <v-col cols="8" md="12" class="pl-3 pl-sm-0">
              <div class="grey--text text--darken-2">
                <div v-if="playdate.teacher" class="text-subtitle-1 text-sm-h6 font-weight-bold">
                  Playdates with {{ playdate.teacher }}
                </div>

                <div class="mt-2">
                  {{ date }}
                </div>
              </div>
            </v-col>
          </v-row>

          <!-- PLAYDATE START TIME -->
          <div class="grey--text text--darken-2 text-capitalize mt-4 mt-sm-2">
            {{ day }} {{ start }}
          </div>

          <!-- SPOTS -->
          <div class="caption mt-3">
            Spots Available:

            <v-row
              justify="start"
              no-gutters
              class="pt-2"
            >
              <v-img
                v-for="(bImage, indexBI) in backpackImages"
                :key="indexBI"
                :src="bImage"
                :class="{ 'ml-n3': indexBI }"
                class="backpack-image"
                max-width="36"
              />

              <span class="ml-1 mt-2">
                {{ playdate.spots - backpackImages.length }}/{{ playdate.spots }}
              </span>
            </v-row>
          </div>

          <slot name="button">
            <v-row no-gutters class="mt-6">
              <!-- SEE DETAILS BUTTON -->
              <v-col cols="12">
                <v-btn
                  :disabled="isInAPlaydate && !hasSpotInThisPlaydate"
                  class="!pg-shadow-button white--text text-transform-none"
                  color="accent"
                  data-test-id="card-playdate-open-button"
                  block
                  @click="actionPrimaryButton"
                >
                  {{ hasSpotInThisPlaydate ? 'SEE DETAILS' : 'JOIN PLAYDATE' }}
                </v-btn>
              </v-col>

              <!-- CANCEL SPOT BUTTON  -->
              <v-col v-if="hasSpotInThisPlaydate && !manangement" cols="12" class="mt-3">
                <v-btn
                  :loading="isLoadingSpotAction"
                  class="!pg-shadow-button red lighten-4 grey--text text--darken-2 text-transform-none"
                  data-test-id="card-playdate-open-button"
                  block
                  @click="handleCancelSpot"
                >
                  <v-icon class="red--text">
                    mdi-delete
                  </v-icon>
                  CANCEL SPOT
                </v-btn>
              </v-col>
            </v-row>
          </slot>
        </v-col>
      </v-row>
    </v-card>

    <!-- MORE THAN ONE PLAYDATE WARNING -->
    <div v-if="isInAPlaydate && !hasSpotInThisPlaydate" class="mt-3 font-weight-medium">
      *You can only join one playdate per week.
    </div>

    <!-- CardPlaydatePopup -->
    <pg-dialog
      id="playdate-dialog"
      v-model="dialog"
      fullscreen
      content-class="elevation-0"
      width="100%"
      height="100%"
      persistent
    >
      <div class="overlay" />

      <v-container class="pa-0" fluid data-test-id="playdate-modal">
        <v-row no-gutters justify="start">
          <v-btn
            class="top-left text-none text--white py-8"
            color="white"
            text
            data-test-id="playdate-modal-back-button"
            @click="dialog = false"
          >
            <v-icon class="mr-2" small left color="white">
              mdi-less-than
            </v-icon>
            Back
          </v-btn>

          <div class="close-btn">
            <v-btn
              class="text-none text--white py-8"
              color="white"
              icon
              data-test-id="playdate-modal-close-button"
              @click="dialog = false"
            >
              <v-icon>
                mdi-close
              </v-icon>
            </v-btn>
          </div>
        </v-row>

        <v-row align="center" justify="center" no-gutters>
          <v-col class="px-3 pb-12 px-lg-0" cols="12" lg="8" xl="10">
            <v-card
              class="mx-sm-auto mx-sm-5 mt-sm-16 mt-sm-0"
              max-width="800"
              elevation="2"
            >
              <div class="green-line green-line-1" />
              <div class="green-line green-line-2" />

              <v-row justify="center" no-gutters class="pa-3 pa-sm-6">
                <v-col cols="12" sm="6" class="d-flex justify-center align-center">
                  <img
                    :src="require('@/assets/png/playdates/playdate.png')"
                    alt="Educational Playdates"
                    :width="isMobile ? '200px' : '100%'"
                  >
                </v-col>

                <v-col cols="12" sm="6" class="pl-sm-3">
                  <div class="grey--text text--darken-2 pb-1 pt-3 pt-sm-0">
                    <div v-if="playdate.teacher" class="text-center text-sm-left text-h6 text-sm-h5 font-weight-bold">
                      Playdates with {{ playdate.teacher }}
                    </div>

                    <div class="text-center text-md-left text-body-2 text-md-subtitle-1 py-1">
                      {{ date }}
                    </div>

                    <div class="text-subtitle-1 text-capitalize py-1">
                      {{ day }} {{ start }}
                    </div>
                  </div>

                  <div class="pt-1 text-justify pr-3 description-text">
                    <div class="grey--text text--darken-2 font-weight-bold">
                      Description
                    </div>

                    <p class="text-body-2 my-3">
                      {{ playdate.description }}
                    </p>
                  </div>

                  <div class="pt-1">
                    <div class="grey--text text--darken-2 font-weight-bold">
                      Spots
                    </div>

                    <v-row justify-md="start" no-gutters class="pt-2">
                      <v-img
                        v-for="(bImage, indexBI) in backpackImages"
                        :key="indexBI"
                        :src="bImage"
                        :class="{ 'ml-n3': indexBI }"
                        max-width="45"
                        class="backpack-image"
                      />

                      <span class="ml-1">
                        {{ backpackImages.length }}/{{ playdate.spots }}
                      </span>
                    </v-row>
                  </div>

                  <div class="pt-5">
                    <div class="grey--text text--darken-2 font-weight-bold mb-2">
                      Who is going?
                    </div>

                    <div class="mr-0 mr-sm-8">
                      <child-select v-if="!hasSpotInThisPlaydate" v-model="childId" hide-details />
                      <child-select v-else-if="child" :value="child.id" disabled hide-details />
                    </div>
                  </div>
                </v-col>

                <v-col cols="12" sm="8" class="mt-6">
                  <v-btn
                    v-if="!hasSpotInThisPlaydate"
                    :disabled="!childId"
                    :loading="isLoadingSpotAction"
                    class="!pg-shadow-button !pg-text-[18px] text-none white--text"
                    color="accent"
                    target="_blank"
                    block
                    large
                    data-test-id="card-playdate-join-button"
                    @click="handleReserveSpot"
                  >
                    Reserve Spot
                  </v-btn>

                  <v-btn
                    v-if="hasSpotInThisPlaydate"
                    :href="playdate.link"
                    block
                    class="white--text text-none !pg-text-[18px] !pg-shadow-button"
                    color="accent"
                    data-test-id="card-playdate-open-button"
                    target="_blank"
                    x-large
                    @click="handleOpenZoom"
                  >
                    Get Zoom Link
                  </v-btn>

                  <pg-ics-calendar v-if="hasSpotInThisPlaydate" :entry="icsEntry" class="mt-3" />
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </pg-dialog>
  </div>
</template>

<script>
import { defineComponent, useStore, useRouter } from '@nuxtjs/composition-api'
import { mapGetters } from 'vuex'
import dayjs from 'dayjs'
import { get } from 'lodash'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import utc from 'dayjs/plugin/utc'

import { TAG_MANAGER_EVENTS } from '@/models'

import ChildSelect from '@/components/app/ChildSelect.vue'
import { useChild, usePlaydates, useSnotifyHelper } from '@/composables'
import { computed, ref } from '@vue/composition-api'

dayjs.extend(customParseFormat)
dayjs.extend(utc)

export default defineComponent({
  name: 'CardPlaydate',

  components: {
    ChildSelect
  },

  props: {
    finding: {
      type: Boolean,
      default: false
    },

    joining: {
      type: Boolean,
      default: true
    },

    manangement: {
      type: Boolean,
      default: false,
      required: false
    },

    playdate: {
      type: Object,
      required: true
    },

    playdates: {
      type: Array,
      default: () => []
    },

    isInAPlaydate: {
      type: Boolean,
      default: false
    }
  },

  setup (props, { emit }) {
    const router = useRouter()
    const snotify = useSnotifyHelper()
    const store = useStore()
    const { reserveASpot, cancelSpotReservation } = usePlaydates({ store })
    const { children } = useChild({ store })

    const isLoadingSpotAction = ref(false)
    const dialog = ref(false)
    const childId = ref(null)
    const playdate = computed(() => props.playdate)

    const child = computed(() => {
      return children.value.find(({ id }) => {
        return playdate.value.backpackImages.find(({ childrenId }) => {
          return id === childrenId
        })
      })
    })

    const hasSpotInThisPlaydate = computed(() => {
      return (props.manangement)
        ? true
        : Boolean(playdate.value?.backpackImages?.find(({ childrenId }) => {
          return children.value.find(({ id }) => {
            return id === childrenId
          })
        }))
    })

    const actionPrimaryButton = () => {
      if (props.manangement) {
        router.push({
          name: 'admin-playdates-management-detail',
          query: { id: playdate.value.id }
        })
      } else {
        dialog.value = true
      }
    }

    const handleReserveSpot = async () => {
      try {
        isLoadingSpotAction.value = true

        await reserveASpot({ playdateId: props.playdate.id, childId: childId.value, date: props.playdate.date })

        childId.value = null
        snotify.success('Spot reserved!')
        emit('spot-reserved')
      } catch (error) {

      } finally {
        isLoadingSpotAction.value = false
      }
    }

    const handleCancelSpot = async () => {
      try {
        isLoadingSpotAction.value = true

        await cancelSpotReservation({ playdateId: props.playdate.id, childId: child.value.id, date: props.playdate.date })

        childId.value = null
        snotify.success('Spot cancelled!')
        emit('spot-canceled')
      } catch (error) {

      } finally {
        isLoadingSpotAction.value = false
      }
    }

    return {
      child,
      childId,
      dialog,
      actionPrimaryButton,
      handleCancelSpot,
      handleReserveSpot,
      hasSpotInThisPlaydate,
      isLoadingSpotAction
    }
  },

  data: () => ({
    name: null,
    backpack: null,
    today: new Date().getUTCDay(),

    week: {
      MONDAY: 1,
      TUESDAY: 2,
      WEDNESDAY: 3,
      THURSDAY: 4,
      FRIDAY: 5
    }
  }),

  computed: {
    ...mapGetters('auth', ['getUserInfo']),

    backpackImages () {
      return get(this.playdate, 'backpackImages', []).map(({ image }) => image)
    },

    date () {
      const date = this.playdate.dateStart

      if (date) {
        return dayjs(date).format('MMMM DD, YYYY')
      }

      return null
    },

    day () {
      if (!this.playdate.dateStart) {
        return null
      }

      if (
        dayjs().isSame(dayjs(this.playdate.dateStart), 'day')
      ) {
        return 'Today'
      }

      const dateStart = new Date(this.playdate.dateStart)
      this.playdate.day = dayjs(dateStart).format('dddd')
      return `Next ${this.playdate.day.toLowerCase()}`
    },

    duration () {
      if (!this.hasDay) {
        return null
      }

      return this.times.end.diff(this.times.start, 'm')
    },

    hasBackpackImages () {
      return Boolean(this.playdate.children.backpack)
    },

    hasDay () {
      return Boolean(this.playdate.day)
    },

    icsEntry () {
      if (!this.hasDay) {
        return null
      }

      return {
        title: this.playdate.name,
        description: this.playdate.description,
        link: this.playdate.link,
        teacher: this.playdate.teacher,
        dateStart: this.times.start,
        dateEnd: this.times.end
      }
    },

    specialist () {
      return get(this.playdate, 'specialistUser.user')
    },

    start () {
      if (!this.hasDay) {
        return null
      }

      const startTime = this.times.start.format('hh:mm')
      const startMeridian = this.times.start.format('a')

      return `at ${startTime} ${startMeridian}`
    },

    times () {
      if (!this.hasDay) {
        return null
      }

      const start = dayjs(this.playdate.dateStart)
        .utc()
        .add((this.week[this.playdate.day] || 6) - this.today, 'days')
        .local()
      const end = dayjs(this.playdate.end)
        .utc()
        .add((this.week[this.playdate.day] || 6) - this.today, 'days')
        .local()

      return {
        start,
        end
      }
    },

    isMobile () {
      return this.$vuetify.breakpoint.xs
    }
  },

  methods: {
    handleOpenZoom () {
      this.$gtm.push({
        event: TAG_MANAGER_EVENTS.PLAYDATE_OPEN_ZOOM,
        userId: this.getUserInfo.id,
        topic: this.playdate.playdateType
      })
    }
  }
})
</script>

<style lang="scss" scoped>
.\!pg-text-\[18px\] {
  font-size: 18px !important;
}

.overlay {
  background-color: rgba(0, 0, 0, 0.68) !important;
  position: fixed;
  top: 0;
  bottom: 0;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 2500;
}
</style>
