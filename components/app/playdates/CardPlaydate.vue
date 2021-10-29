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
      <v-row justify="center" class="pa-3 pa-md-6" no-gutters>
        <!-- IMAGE ONLY ON DESKTOP -->
        <v-col md="5" class="d-none d-md-block align-self-center">
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
        <v-col cols="12" md="7" class="pl-md-3">
          <v-row no-gutters>
            <!-- IMAGE ONLY ON MOBILE -->
            <v-col cols="4" class="d-md-none">
              <v-img
                alt="Educational Playdates"
                contain
                :max-height="500"
                :src="require('@/assets/png/playdates/playdate.png')"
              />
            </v-col>

            <!-- PLAYDATE SPECIALIST AND DATE -->
            <v-col cols="8" md="12" class="pl-3 pl-md-0">
              <div class="grey--text text--darken-2">
                <div v-if="specialist" class="text-subtitle-1 text-md-h6 font-weight-bold">
                  Playdates with {{ specialist.fullName }}
                </div>

                <div class="mt-2">
                  {{ date }}
                </div>
              </div>
            </v-col>
          </v-row>

          <!-- PLAYDATE START TIME -->
          <div class="grey--text text--darken-2 text-capitalize mt-4 mt-md-2">
            {{ day }} {{ start }}
          </div>

          <!-- SPOTS -->
          <div class="caption mt-3">
            Spots:

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
                {{ backpackImages.length }}/{{ playdate.spots }}
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
                  @click="dialog = true"
                >
                  {{ hasSpotInThisPlaydate ? 'SEE DETAILS' : 'JOIN PLAYDATE' }}
                </v-btn>
              </v-col>

              <!-- CANCEL SPOT BUTTON  -->
              <v-col v-if="hasSpotInThisPlaydate" cols="12" class="mt-3">
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
      v-model="dialog"
      fullscreen
      content-class="elevation-0"
      width="100%"
      height="100%"
      persistent
    >
      <v-container class="vh-container overlay fullscreen pa-0" fluid data-test-id="playdate-modal">
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

        <v-row class="vh-row" align="center" justify="center" no-gutters>
          <v-col class="px-3 px-lg-0" sm="12" lg="8" xl="10">
            <v-card
              class="mx-md-auto mx-sm-5 mt-md-16 mt-sm-0"
              max-width="800"
              max-height="800"
              elevation="2"
            >
              <div class="green-line green-line-1" />
              <div class="green-line green-line-2" />

              <v-row justify="center" no-gutters class="px-4 mt-6">
                <v-col md="6" cols="12" class="align-self-center">
                  <v-row justify="center" no-gutters>
                    <v-col align-self="center">
                      <v-row justify="center" class="mt-2">
                        <v-avatar size="325">
                          <v-img
                            max-width="325"
                            alt="Educational Playdates"
                            :src="
                              require('@/assets/png/playdates/playdate.png')
                            "
                            class="align-self-center"
                          />
                        </v-avatar>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-col>

                <v-col md="6" cols="12">
                  <v-list-item three-line>
                    <v-list-item-content>
                      <v-list-item-title class="grey--text text--darken-2 pb-1">
                        <div v-if="specialist" class="text-h5 text-truncate font-weight-bold">
                          Playdates with {{ specialist.fullName }}
                        </div>

                        <div class="pg-text-[18px] py-2">
                          {{ date }}
                        </div>

                        <div class="pg-text-[18px] text-capitalize py-2">
                          {{ day }} {{ start }}
                        </div>
                      </v-list-item-title>

                      <div class="pt-1 text-justify pr-3 description-text">
                        <div class="grey--text text--darken-2 font-weight-bold">
                          Description
                        </div>

                        <p class="text-body-2 my-3">
                          {{ playdate.description }}
                        </p>
                      </div>

                      <v-list-item-subtitle class="pt-1">
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
                      </v-list-item-subtitle>

                      <v-list-item-subtitle class="pt-5">
                        <div class="grey--text text--darken-2 font-weight-bold mb-2">
                          Who is going?
                        </div>

                        <child-select v-if="!hasSpotInThisPlaydate" v-model="childId" hide-details />
                        <child-select v-else-if="child" :value="child.id" disabled hide-details />
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-col>
              </v-row>

              <v-row justify="center" no-gutters class="pt-8">
                <v-col cols="8" class="mb-5 mt-0">
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
                    class="white--text mb-3"
                    color="accent"
                    data-test-id="card-playdate-open-button"
                    target="_blank"
                    x-large
                    @click="handleOpenZoom"
                  >
                    Get Zoom Link
                  </v-btn>

                  <pg-ics-calendar v-if="hasSpotInThisPlaydate" :entry="icsEntry" />
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
import { defineComponent, useStore } from '@nuxtjs/composition-api'
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
    const snotify = useSnotifyHelper()
    const store = useStore()
    const { reserveASpot, cancelSpotReservation } = usePlaydates({ store })
    const { children } = useChild({ store })

    const isLoadingSpotAction = ref(false)
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
      return Boolean(playdate.value?.backpackImages?.find(({ childrenId }) => {
        return children.value.find(({ id }) => {
          return id === childrenId
        })
      }))
    })

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
      handleCancelSpot,
      handleReserveSpot,
      hasSpotInThisPlaydate,
      isLoadingSpotAction
    }
  },

  data: () => ({
    dialog: false,
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
      const date = this.playdate.date

      if (date) {
        return dayjs(date).format('MMMM DD, YYYY')
      }

      return null
    },

    day () {
      if (!this.hasDay) {
        return null
      }

      if (
        this.today === this.week[this.playdate.day] &&
        this.times.end.isAfter(new Date())
      ) {
        return 'Today'
      }

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

      const start = dayjs
        .utc(this.playdate.start, 'HH:mm:ss')
        .add((this.week[this.playdate.day] || 6) - this.today, 'days')
        .local()
      const end = dayjs
        .utc(this.playdate.end, 'HH:mm:ss')
        .add((this.week[this.playdate.day] || 6) - this.today, 'days')
        .local()

      return {
        start,
        end
      }
    },

    isMobile () {
      return this.$vuetify.breakpoint.smAndDown
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
.fullscreen {
  width: 100% !important;
  height: 100% !important;
}

.vh-container {
  min-height: 120vh;
}
.vh-row {
  min-height: 90vh;
}

.overlay {
  background-color: rgba(0, 0, 0, 0.68) !important;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 2500;
}

.description-text {
  line-clamp: none !important;
  -webkit-line-clamp: none;
  color: rgba(0, 0, 0, 0.6);
  line-height: 1.2;
  font-size: 0.875rem;
}

.custom-card-border {
  background: #FFFFFF;
  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.15) !important;
  border-radius: 8px !important;
}

.backpack-img {
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.203922);
}
</style>
