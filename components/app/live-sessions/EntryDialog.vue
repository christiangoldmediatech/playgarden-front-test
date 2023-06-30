<template>
  <v-dialog
    v-model="dialog"
    class="entry-overlay !pg-z-[10000] !pg-w-fit"
    @click:outside="dialog = false"
  >
    <div
      class="entry-container"
    >
      <v-btn icon class="pg-bg-[#FFA0C8] !pg-p-0 md:!pg-p-5 !pg-absolute !pg-right-5 md:!pg-right-10 !pg-top-[6rem] md:!pg-top-10 !pg-z-50" @click="dialog = false">
        <v-icon :size="$vuetify.breakpoint.mdAndUp ? 35 : 20" color="white">
          mdi-close
        </v-icon>
      </v-btn>
      <template v-if="entry">
        <v-card
          class="entry-card"
          :style="{
            '--borderColor': entry.type === 'LiveClass' ? '#F89838' : '#68C453'
          }"
        >
          <v-container class="entry-card-content">
            <v-row>
              <v-col cols="12" md="5">
                <div
                  v-if="$vuetify.breakpoint.mdAndUp"
                  class="entry-card-elipse"
                >
                  <div v-if="entry.teacher" class="pg-relative">
                    <img
                      class="entry-card-elipse-img ml-1 mt-1 pg-object-cover"
                      :src="entry.teacher.img"
                    />
                    <img
                      v-if="entry.type === 'LiveClass'"
                      class="pg-w-[50px] pg-h-[50px] pg-bg-white pg-rounded-full pg-p-1 pg-shadow-sm pg-absolute pg-bottom-0 pg-right-[-5px]"
                      :src="entry.activityType.icon"
                    />
                  </div>
                  <div v-else>
                    <img
                      v-if="entry.type === 'LiveClass'"
                      class="lsess-table-entry-type ml-1 mt-1"
                      :src="entry.activityType.icon"
                    />
                  </div>
                </div>
              </v-col>
              <v-col cols="12" md="7">
                <div
                  class="pg-flex pg-gap-3"
                  :class="{ 'pg-mb-5 pg-mt-4 md:pg-mt-0': entry.type !== 'LiveClass' }"
                >
                  <div v-if="$vuetify.breakpoint.mdAndDown" class="pg-w-5/12 ">
                    <div v-if="entry.teacher">
                      <img class="pg-w-full" :src="entry.teacher.img" />
                      <img
                        v-if="entry.type === 'LiveClass'"
                        class="pg-w-[50px] pg-h-[50px] pg-bg-white pg-rounded-full pg-p-1 pg-shadow-sm pg-absolute pg-bottom-0 pg-right-[-5px]"
                        :src="entry.activityType.icon"
                      />
                    </div>
                    <div v-else>
                      <img
                        v-if="entry.type === 'LiveClass'"
                        class="lsess-table-entry-type ml-1 mt-1"
                        :src="entry.activityType.icon"
                      />
                    </div>
                  </div>
                  <div class="pg-w-7/12 md:pg-w-full">
                    <div
                      class="entry-card-title pg-text-center md:pg-text-left pg-text-pg-grey pg-font-quick"
                    >
                      {{ entry.title }}
                    </div>
                    <div
                      v-if="$vuetify.breakpoint.mdAndUp"
                      class="entry-card-date pg-text-center md:pg-text-left pg-text-pg-grey-2 "
                    >
                      {{ date[0] }}, {{ date[1] }}
                    </div>
                    <div
                      v-else
                      class="entry-card-date pg-text-center md:pg-text-left pg-text-pg-grey-2"
                    >
                      {{ date[0] }} <br />
                      {{ date[1] }}
                    </div>
                    <div
                      v-if="entry.teacher && entry.type === 'LiveClass'"
                      class="entry-card-teacher pb-10 pg-text-center md:pg-text-left pg-text-pg-grey-2"
                    >
                      {{ $t('commonWords.prepositionText') + ' ' + entry.teacher.name }}
                    </div>
                    <div
                      v-else-if="!entry.teacher && entry.type === 'LiveClass'"
                      class="entry-card-teacher pb-10 pg-text-center md:pg-text-left pg-text-pg-grey-2"
                    >
                      {{ $t('commonWords.prepositionText') + ' ' + entry.teacherName }}
                    </div>
                  </div>
                </div>

                <div class="entry-card-description pb-3">
                  <p
                    class="entry-card-description-title"
                    :style="{
                      '--textColor':
                        entry.type === 'LiveClass' ? '#F89838' : '#68C453'
                    }"
                  >
                    {{ $t('liveClasses.entryDialog.description') }}
                  </p>
                  <span class="pg-text-lg pg-font-normal pg-text-black">{{ entry.description }}</span>
                </div>

                <div class="pb-6">
                  <v-btn
                    v-if="entry.file"
                    nuxt
                    large
                    color="primary"
                    class="text-transform-none"
                    :target="downloadTarget"
                    :href="entry.file"
                  >
                    <v-icon left>
                      mdi-download-outline
                    </v-icon>
                    <template v-if="isCooking">
                      {{ $t('liveClasses.entryDialog.download1') }}
                    </template>
                    <template v-else>
                      {{ $t('liveClasses.entryDialog.download2') }}
                    </template>
                  </v-btn>
                </div>
                <div
                  v-if="entry.type === 'LiveClass'"
                  class="entry-card-description pb-6"
                >
                  <p
                    class="entry-card-description-title"
                    :style="{
                      '--textColor':
                        entry.type === 'LiveClass' ? '#F89838' : '#68C453'
                    }"
                  >
                    {{ $t('liveClasses.entryDialog.recommendedAges') }}
                  </p>
                  {{ entry.ages }}
                </div>
                <div
                  v-if="entry.type === 'Playdate'"
                  class="entry-card-description pg-flex pg-items-center pg-gap-4"
                  :class="[entry.backpackImages.length < entry.spots ? 'pb-6' : ' pb-3']"
                >
                  <p
                    class="entry-card-description-title mb-0"
                    :style="{
                      '--textColor':
                        entry.type === 'LiveClass' ? '#F89838' : '#68C453'
                    }"
                  >
                    {{ $t('liveClasses.entryDialog.spots') }}
                  </p>
                  <div class="pg-w-8/12">
                    <v-progress-linear
                      height="30"
                      rounded
                      background-color="#EDEDED"
                      :color="entry.backpackImages.length < entry.spots ? '#68C453' : '#FF9B3C'"
                      :value="(entry.backpackImages.length / entry.spots) * 100"
                    >
                      <template v-slot:default="{ value }">
                        <strong :class="[entry.backpackImages.length < entry.spots ? 'pg-text-black' : 'pg-text-white']">{{ Math.ceil(value) / 10 }} / {{ entry.spots }}</strong>
                      </template>
                    </v-progress-linear>
                  </div>
                </div>

                <p v-if="entry.type === 'Playdate' && entry.backpackImages.length >= entry.spots" class="pg-text-accent">
                  {{ $t('liveClasses.entryDialog.fullClass') }}
                </p>

                <div
                  v-if="entry.type === 'Playdate'"
                  class="entry-card-description pb-6"
                >
                  <p
                    class="entry-card-description-title mb-0"
                    :style="{
                      '--textColor':
                        entry.type === 'LiveClass' ? '#F89838' : '#68C453'
                    }"
                  >
                    {{ $t('liveClasses.entryDialog.whoIsGoing') }}
                  </p>
                  <div class="mr-0 mr-sm-8 mt-3">
                    <child-select
                      v-if="!hasSpotInThisPlaydate"
                      v-model="childId"
                      :disabled="hasPlayAndLearnPlanLivePlan"
                      hide-details
                    />
                    <child-select
                      v-else-if="child"
                      :value="child.id"
                      disabled
                      hide-details
                    />
                  </div>
                </div>

                <div
                  v-if="entry.inCollaborationWith"
                  class="entry-card-description-title pb-6 d-flex align-start"
                >
                  {{ $t('liveClasses.entryDialog.by') }}
                  <img
                    class="entry-card-collaborator ml-6"
                    :src="entry.inCollaborationWith"
                  />
                </div>
              </v-col>
            </v-row>

            <div v-if="isRecorded" class="pb-3">
              <v-btn
                class="white--text text-none"
                color="accent"
                x-large
                block
                @click.stop="openVideo"
              >
                {{ $t('liveClasses.entryDialog.watchRecorded') }}
              </v-btn>
            </div>

            <div
              class="pg-w-full pg-mx-auto pg-mt-10"
              :class="[
                {'pg-flex pg-flex-col pg-items-center': hasPlayAndLearnPlanLivePlan && entry.type === 'Playdate'},
                hasPlayAndLearnPlanLivePlan && entry.type === 'Playdate' ? 'md:pg-w-10/12' : 'md:pg-w-8/12']"
            >
              <v-btn
                v-if="entry.type === 'Playdate' && !hasSpotInThisPlaydate && !hasPlayAndLearnPlanLivePlan"
                :disabled="!childId || entry.cancelled || entry.backpackImages.length >= entry.spots"
                :loading="isLoadingSpotAction"
                class="!pg-shadow-button !pg-text-[18px] text-none white--text"
                color="#FD82AC"
                target="_blank"
                block
                large
                data-test-id="card-playdate-join-button"
                @click="handleReserveSpot"
              >
                {{ $t('liveClasses.entryDialog.reserve') }}
              </v-btn>

              <v-btn
                v-if="hasPlayAndLearnPlanLivePlan && entry.type === 'Playdate'"
                color="#FD82AC"
                class="!pg-shadow-button !pg-text-[18px] text-none white--text !pg-uppercase !pg-mx-auto"
                large
                nuxt
                link
                to="/app/payment/plan"
              >
                <v-icon class="pg-mr-2">
                  mdi-lock-outline
                </v-icon>
                {{ $t('liveClasses.entryDialog.unlock') }} <span class="pg-text-[#CD0088] pg-mx-1"> {{ $t('commonWords.onlinePreschool') }} </span> {{ $t('commonWords.plan') }}
              </v-btn>

              <v-btn
                v-if="hasSpotInThisPlaydate"
                :loading="isLoadingSpotAction"
                class="!pg-shadow-button !pg-text-[18px] red lighten-4 grey--text text--darken-2 text-transform-none pg-mb-5"
                block
                large
                data-test-id="card-playdate-cancel-button"
                @click="handleCancelSpot"
              >
                <v-icon class="red--text">
                  mdi-delete
                </v-icon>
                {{ $t('liveClasses.entryDialog.cancel') }}
              </v-btn>

              <div v-if="!past" class="pb-3 mb-3">
                <v-btn
                  v-if="entry.type === 'LiveClass'"
                  class="white--text"
                  color="accent"
                  x-large
                  :href="entry.link"
                  :disabled="!isLive || entry.cancelled"
                  target="_blank"
                  block
                  @click="doSaveAttendance"
                >
                  {{ $t('liveClasses.entryDialog.open') }}
                </v-btn>
                <v-btn
                  v-else-if="child"
                  class="white--text"
                  color="accent"
                  x-large
                  :href="entry.link"
                  target="_blank"
                  :disabled="entry.cancelled"
                  block
                  @click="doSaveAttendance"
                >
                  {{ $t('liveClasses.entryDialog.open') }}
                </v-btn>
              </div>

              <div v-if="!past" class="pg-calendar-border">
                <pg-ics-calendar :entry="entry" />
              </div>
            </div>
          </v-container>
        </v-card>
      </template>
    </div>
  </v-dialog>
</template>

<script>
import { ref, computed, useStore } from '@nuxtjs/composition-api'
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'
import { TAG_MANAGER_EVENTS } from '@/models'
import { useChild, useLanguageHelper, usePlaydates, useToastHelper } from '@/composables'
import { getNumberOrder, formatTimezone } from '@/utils/dateTools'
import ChildSelect from '@/components/app/ChildSelect.vue'

export default {
  name: 'EntryDialog',

  components: {
    ChildSelect
  },

  setup(_, { emit }) {
    const toast = useToastHelper()
    const store = useStore()
    const { reserveASpot, cancelSpotReservation } = usePlaydates({ store })
    const { children } = useChild({ store })
    const language = useLanguageHelper()

    const childId = ref(null)
    const isLoadingSpotAction = ref(false)
    const dialog = ref(false)
    const entry = ref(null)
    const playdate = computed(() => entry.value)
    const months = [
      language.t('liveClasses.months.january'),
      language.t('liveClasses.months.february'),
      language.t('liveClasses.months.march'),
      language.t('liveClasses.months.april'),
      language.t('liveClasses.months.may'),
      language.t('liveClasses.months.june'),
      language.t('liveClasses.months.july'),
      language.t('liveClasses.months.august'),
      language.t('liveClasses.months.september'),
      language.t('liveClasses.months.october'),
      language.t('liveClasses.months.november'),
      language.t('liveClasses.months.december')
    ]

    const hasPlayAndLearnPlanLivePlan = computed(
      () => store.getters['auth/hasPlayAndLearnLivePlan']
    )

    const child = computed(() => {
      return children.value.find(({ id }) => {
        return playdate.value?.backpackImages?.find(({ childrenId }) => {
          return id === childrenId
        })
      })
    })

    const hasSpotInThisPlaydate = computed(() => {
      return Boolean(
        playdate.value?.backpackImages?.find(({ childrenId }) => {
          return children.value.find(({ id }) => {
            return id === childrenId
          })
        })
      )
    })

    const handleReserveSpot = async () => {
      try {
        isLoadingSpotAction.value = true
        await reserveASpot({
          playdateId: playdate.value.id,
          childId: childId.value,
          date: playdate.value.dateStart
        })

        childId.value = null
        toast.success('Spot reserved!')
        dialog.value = false
        emit('refresh')
      } catch (error) {
        toast.error(error)
      } finally {
        isLoadingSpotAction.value = false
      }
    }

    const handleCancelSpot = async () => {
      try {
        isLoadingSpotAction.value = true
        await cancelSpotReservation({
          playdateId: playdate.value.id,
          childId: child.value.id,
          date: playdate.value.dateStart
        })
        childId.value = null
        toast.success('Spot cancelled!')
        dialog.value = false
        emit('refresh')
      } catch (error) {
        toast.error('Sorry! Spot could not be cancelled')
      } finally {
        isLoadingSpotAction.value = false
      }
    }

    return {
      dialog,
      entry,
      months,
      hasSpotInThisPlaydate,
      childId,
      isLoadingSpotAction,
      child,
      handleReserveSpot,
      handleCancelSpot,
      hasPlayAndLearnPlanLivePlan
    }
  },

  computed: {
    ...mapGetters('auth', ['getUserInfo']),

    isCooking() {
      let isCooking = false

      if (this.entry) {
        // check name
        if (this.entry.name) {
          const entryName = this.entry.name.toLowerCase()
          isCooking = entryName.includes('cooking')
        }

        // check activity type
        if (this.entry.activityType && this.entry.activityType.name) {
          const activityName = this.entry.activityType.name.toLowerCase()
          if (
            activityName.includes('cooking') ||
            activityName.includes('nutrition')
          ) {
            isCooking = true
          }
        }
      }

      return isCooking
    },

    downloadTarget() {
      if (this.isCooking) {
        return '_blank'
      }
      return this.entry.downloadNewTab ? '_blank' : '_self'
    },

    isLive() {
      const today = new Date()
      const start = new Date(this.entry.dateStart)
      const end = new Date(this.entry.dateEnd)

      return (
        today.getTime() >= start.getTime() - 30 * 60 * 1000 &&
        today.getTime() <= end.getTime() + 30 * 60 * 1000
      )
    },

    past() {
      const today = new Date()
      const end = new Date(this.entry.dateEnd)

      return today.getTime() >= end.getTime() + 30 * 60 * 1000
    },

    isRecorded() {
      return (
        this.entry.videos &&
        this.entry.videos.videoUrl &&
        this.entry.videos.videoUrl.HLS
      )
    },

    ages() {
      if (this.entry && !isNaN(this.entry.ages)) {
        return `2${this.entry.ages > 2 ? ' - ' + this.entry.ages : ''}`
      }
      return 'All ages'
    },

    date() {
      if (this.entry) {
        const { timezone } = this.getUserInfo
        const date = moment(this.entry.dateStart)
        const endDate = moment(this.entry.dateEnd)
        const monthAndDay = `${this.months[date.month()]} ${getNumberOrder(
          date.date()
        )}`
        const startTime = formatTimezone(date, {
          format: 'hh:mma',
          timezone,
          returnObject: false
        })
        const endTime = formatTimezone(endDate, {
          format: 'hh:mma',
          timezone,
          returnObject: false
        })
        return [monthAndDay, `${startTime} - ${endTime}`]
      }
      return ''
    }
  },

  watch: {
    dialog(val) {
      if (val) {
        document.querySelector('html').style.overflowY = 'hidden'
      } else {
        document.querySelector('html').style.overflowY = 'auto'
      }
    }
  },

  created() {
    this.$nuxt.$on('open-entry-dialog', (entry) => {
      this.entry = entry
      this.dialog = true
    })
  },

  methods: {
    ...mapActions('live-sessions', ['saveAttendance']),

    doSaveAttendance() {
      this.saveAttendance(this.entry.id)
      this.$gtm.push({
        event: TAG_MANAGER_EVENTS.LIVE_CLASSES_ITEM_ZOOM_LINK_CLICKED,
        userId: this.getUserInfo.id,
        topic: this.entry.activityType.name,
        topicDescription: this.entry.title,
        itemDateTime: this.entry.dateStart
      })
    },

    openVideo() {
      let title = this.entry.title
      let author
      if (
        this.entry.activityType &&
        this.entry.activityType.name &&
        this.entry.teacher
      ) {
        title = this.entry.activityType.name
        author = `with ${this.entry.teacher}`
      }
      let videoIcon
      if (this.entry.activityType && this.entry.activityType.icon) {
        videoIcon = this.entry.activityType.icon
      }

      this.$nuxt.$emit('open-recorded-class-player', [
        {
          title,
          src: {
            url: this.entry.videos.videoUrl.HLS,
            type: 'application/x-mpegURL'
          },
          meta: {
            videoId: this.entry.videos.id,
            author,
            videoIcon,
            videoType: 'RECORDED CLASS:'
          }
        }
      ])
      this.$gtm.push({
        event: TAG_MANAGER_EVENTS.LIVE_CLASSES_WATCH_RECORDED_VIDEO,
        userId: this.getUserInfo.id,
        topic: this.entry.activityType.name,
        topicDescription: this.entry.title,
        itemDateTime: this.entry.dateStart
      })
    },

    closeDialog() {
      if (this.dialog) {
        this.dialog = false
      }
    }
  }
}
</script>

<style lang="scss">
.v-dialog{
  width: fit-content !important;
  height: fit-content !important;
  box-shadow: none !important;
}
.entry {
  &-overlay .v-overlay__content {
    min-width: 100vw;
    padding: 12px;
  }
  &-container {
    max-width: 1100px;
    max-height: 95vh;
    padding-top: 80px;
    overflow-y: hidden;
    margin: 0 auto;
    position: relative;
    @media screen and (min-width: 960px) {
      padding-top: 0px;
    }
  }
  &-card {
    position: relative;
    overflow-y: auto;
    max-height: 100%;
    border-radius: 40px !important;
    border: 10px solid var(--borderColor) !important;
    &-elipse {
      width: 400px;
      height: 400px;
      margin: 0 auto;
      top: calc(0px - 78px);
      left: calc(50% - 78px);
      background-color: white;
      box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
      border: unset !important;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 300;
      @media screen and (min-width: 960px) {
        width: 300px;
        height: 300px;
        position: static;
        top: auto;
        left: auto;
        z-index: auto;
        margin: 12px;
        border: solid 5px #68c453;
      }
      &-img {
        width: 400px;
        height: 400px;
        object-fit: contain;
        object-position: center;
        @media screen and (min-width: 960px) {
          width: 300px;
          height: 300px;
        }
      }
    }
    &-content {
      max-height: calc(99vh - 200px);
      overflow-y: scroll;
      @media screen and (min-width: 960px) {
        max-height: calc(95vh - 60px);
        padding: 0 12%;
        padding-top: 32px;
        padding-bottom: 32px;
      }
    }
    &-title {
      font-size: 24px;
      font-weight: 700;
      line-height: 1.5;
    }
    &-date {
      font-size: 20px;
      font-weight: 500;
      line-height: 1.5;
    }
    &-teacher {
      font-size: 20px;
      font-weight: 600;
      line-height: 1.5;
    }
    &-description {
      font-weight: 400;
      line-height: 1.5;
      &-title {
        font-weight: 700;
        line-height: 1.5;
        color: var(--textColor);
      }
    }
    &-activity-type {
      font-size: 30px;
      font-weight: bold;
      line-height: 1.87;
    }
    &-collaborator {
      width: 100%;
      max-width: 142px;
    }
  }
}
.pg-calendar-border {
  border: 1px solid #E2E2E2 !important;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.05) !important;
  border-radius: 16px !important;
  padding: 3px;
}
</style>
