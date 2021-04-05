<template>
  <v-card
    class="mx-auto custom-card-border"
    :elevation="joining ? 0 : 2"
    :max-width="joining ? '100%' : 600"
    height="100%"
    tile
  >
    <!-- CARD IMAGE AND TIME -->
    <v-row justify="center" class="py-6 px-3 px-md-2" no-gutters>
      <v-col md="4" cols="12" class="align-self-start">
        <v-row no-gutters>
          <v-col cols="4" md="12">
            <v-img
              alt="Educational Playdates"
              contain
              :max-height="joining ? 500 : 150"
              :src="require('@/assets/png/playdates/playdate.png')"
            />

            <div v-if="!joining" class="text-capitalize grey--text text--darken-2 text-caption mt-2 d-none d-md-flex justify-center">
              {{ day }} <span v-html="start" />
            </div>
          </v-col>

          <v-col class="d-flex flex-column d-md-none align-self-center pl-2">
            <div
              v-if="child.firstName && !finding"
              class="text-h5 font-weight-bold grey--text text--darken-2"
            >
              <template v-if="!joining">
                {{ child.firstName | belongsTo }}
              </template>

              <template v-else>
                {{ child.firstName }}
              </template>

              {{ joining ? "has invited you to a playdate!" : "Playdate" }}
            </div>

            <div v-if="!joining" class="text-capitalize grey--text text--darken-2 text-caption mt-2">
              {{ day }} <span v-html="start" />
            </div>
          </v-col>
        </v-row>
      </v-col>

      <!-- PLAYDATE INFO -->
      <v-col md="8" cols="12">
        <v-row align-content="center" class="fill-height" no-gutters>
          <v-col>
            <v-list-item three-line>
              <v-list-item-content>
                <div
                  v-if="child.firstName && !finding"
                  class="text-h4 pb-2 font-weight-bold grey--text text--darken-2 d-none d-md-flex flex-column"
                >
                  <template v-if="!joining">
                    {{ child.firstName | belongsTo }}
                  </template>

                  <template v-else>
                    {{ child.firstName }}
                  </template>

                  {{ joining ? "has invited you to a playdate!" : "Playdate" }}
                </div>
                <!--
                <v-list-item-title class="overline pb-1">
                  <b>
                    {{ playdate.name }}
                  </b>
                </v-list-item-title>
                -->
                <v-list-item-title class="grey--text text--darken-2 font-weight-medium pb-1">
                  <template v-if="specialist">
                    With {{ specialist.fullName }}
                  </template>

                  <span v-if="joining" class="text-capitalize">
                    {{ day }} <span v-html="start" />
                  </span>
                </v-list-item-title>

                <v-list-item-subtitle v-if="!joining" class="caption pt-3">
                  JOIN YOUR FRIENDS!

                  <v-row
                    justify="start"
                    no-gutters
                    class="pt-2"
                  >
                    <v-img
                      v-for="(bImage, indexBI) in backpackImages"
                      :key="indexBI"
                      :class="{ 'ml-n3': indexBI }"
                      max-width="36"
                      :src="bImage"
                    />

                    <span class="ml-1 mt-2">
                      {{ backpackImages.length }}/{{ playdate.spots }}
                    </span>
                  </v-row>
                </v-list-item-subtitle>

                <v-list-item-subtitle class="mt-3">
                  Ages recommended:<span class="text-subtitle-1 font-weight-medium"> {{ playdate.ages || "All ages" }}</span>
                </v-list-item-subtitle>

                <v-list-item-subtitle class="mt-2">
                  Duration: <span class="text-subtitle-1 font-weight-medium">{{ duration || "30" }} minutes</span>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <slot name="button">
              <v-row no-gutters class="px-4">
                <v-btn
                  class="white--text text-transform-none"
                  color="accent"
                  width="250"
                  :block="isMobile"
                  @click="dialog = true"
                >
                  Open Playdate
                </v-btn>
              </v-row>
            </slot>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- CardPlaydatePopup -->
    <pg-dialog
      v-model="dialog"
      fullscreen
      content-class="elevation-0"
      width="100%"
      height="100%"
      persistent
    >
      <v-container class="vh-container overlay fullscreen pa-0" fluid>
        <v-row no-gutters justify="start">
          <v-btn
            class="top-left text-none text--white py-8"
            color="white"
            text
            @click="dialog = false"
          >
            <v-icon class="mr-2" small left color="white">
              mdi-less-than
            </v-icon>
            Back
          </v-btn>
        </v-row>

        <v-row class="vh-row" align="center" justify="center" no-gutters>
          <v-col class="px-3 px-lg-0" sm="12" lg="8" xl="10">
            <v-card
              class="mx-md-auto mx-sm-5 mt-md-16 mt-sm-0"
              max-width="700"
              max-height="700"
              elevation="2"
            >
              <div class="green-line green-line-1" />
              <div class="green-line green-line-2" />

              <v-row justify="center" no-gutters>
                <v-col md="5" cols="12" class="align-self-center">
                  <v-row justify="center" no-gutters>
                    <v-col align-self="center">
                      <v-row justify="center" class="mt-2">
                        <v-avatar size="120">
                          <v-img
                            max-width="120"
                            alt="Educational Playdates"
                            :src="
                              require('@/assets/png/playdates/playdate.png')
                            "
                            class="align-self-center"
                          />
                        </v-avatar>
                      </v-row>

                      <h5 class="text-capitalize text-center mt-2">
                        {{ day }} <span v-html="start" />
                      </h5>
                    </v-col>
                  </v-row>
                </v-col>

                <v-col md="7" cols="12">
                  <v-list-item three-line>
                    <v-list-item-content>
                      <div
                        v-if="child.firstName && !finding"
                        class="headline pb-2 font-weight-bold"
                      >
                        {{ child.firstName | belongsTo }} Playdate
                      </div>

                      <v-list-item-title>
                        <b>{{ playdate.name }}</b>
                      </v-list-item-title>

                      <v-list-item-title
                        v-if="specialist"
                        class="overline pb-1"
                      >
                        With {{ specialist.fullName }}
                      </v-list-item-title>

                      <div class="pt-1 text-justify pr-3 description-text">
                        <p>{{ playdate.description }}</p>
                      </div>

                      <v-list-item-subtitle class="pt-1">
                        JOIN YOUR FRIENDS!

                        <v-row justify-md="start" no-gutters class="pt-2">
                          <v-img
                            v-for="(bImage, indexBI) in backpackImages"
                            :key="indexBI"
                            :class="{ 'ml-n3': indexBI }"
                            max-width="25"
                            :src="bImage"
                          />

                          <span class="ml-1">
                            {{ backpackImages.length }}/{{ playdate.spots }}
                          </span>
                        </v-row>
                      </v-list-item-subtitle>

                      <v-list-item-subtitle v-if="playdate.ages" class="pt-3">
                        Ages recommended:<b>{{ playdate.ages }}</b>
                      </v-list-item-subtitle>

                      <v-list-item-subtitle v-if="duration" class="pt-3">
                        Duration: <b>{{ duration }} minutes</b>
                      </v-list-item-subtitle>

                      <v-list-item-subtitle v-if="!finding" class="pt-5">
                        <h5>Who is going?</h5>
                        <child-select :value="child.id" hide-details disabled />
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-col>
              </v-row>
              <v-row v-if="finding" justify="center" no-gutters>
                <v-col cols="8" class="mb-0 mt-3">
                  <h5>Select children for Playdate?</h5>
                  <child-select v-model="childId" :playdates="playdates" />
                </v-col>
              </v-row>
              <v-row justify="center" no-gutters>
                <v-col cols="8" class="mb-5 mt-0">
                  <v-btn
                    v-if="!finding"
                    class="white--text"
                    color="accent"
                    target="_blank"
                    block
                    x-large
                    :href="playdate.link"
                  >
                    Open Zoom Playdate
                  </v-btn>

                  <v-btn
                    v-else
                    class="white--text"
                    color="accent"
                    target="_blank"
                    block
                    x-large
                    @click="joinPlaydateChildren"
                  >
                    Join Playdate
                  </v-btn>

                  <pg-ics-calendar :entry="icsEntry" />

                  <v-btn
                    v-if="!finding"
                    color="red"
                    block
                    x-large
                    text
                    @click="remove"
                  >
                    DELETE PLAYDATE
                  </v-btn>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </pg-dialog>
  </v-card>
</template>

<script>
import dayjs from 'dayjs'
import { get } from 'lodash'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { mapActions } from 'vuex'
import utc from 'dayjs/plugin/utc'

import ChildSelect from '@/components/app/ChildSelect.vue'

dayjs.extend(customParseFormat)
dayjs.extend(utc)

export default {
  name: 'CardPlaydate',

  components: {
    ChildSelect
  },

  props: {
    finding: Boolean,

    joining: Boolean,

    playdate: {
      type: Object,
      required: true
    },

    playdates: {
      type: Array,
      default: () => []
    }
  },

  data: () => ({
    dialog: false,
    name: null,
    backpack: null,
    today: new Date().getUTCDay(),
    childId: null,

    week: {
      MONDAY: 1,
      TUESDAY: 2,
      WEDNESDAY: 3,
      THURSDAY: 4,
      FRIDAY: 5
    }
  }),

  computed: {
    backpackImages () {
      return get(this.playdate, 'backpackImages', []).map(({ image }) => image)
    },

    child () {
      return get(this.playdate, 'children', {})
    },

    day () {
      if (!this.hasDay) {
        return null
      }

      if (
        this.today === this.week[this.playdate.day] &&
        this.times.end.isAfter(new Date())
      ) {
        return 'Today: '
      }

      return `Next ${this.playdate.day.toLowerCase()}: `
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

    hasChild () {
      return Boolean(this.child.id)
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

      return `${startTime} <small class="grey--text">${startMeridian}</small>`
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
    ...mapActions('playdates', ['deleteChildren', 'joinPlaydate']),

    async joinPlaydateChildren () {
      try {
        await this.joinPlaydate({
          playdateId: this.playdate.id,
          childId: this.childId
        })
        this.$snotify.success('Children have been successfully added to the playdate!')
        this.$router.push({ name: 'app-playdates' })
      } catch (error) {
        this.$snotify.error('We could not add your child to the Playdate')
      }
    },

    remove () {
      this.$nuxt.$emit('open-prompt', {
        title: 'Delete Play date?',
        message: `Are you sure you wish to delete '${this.child.firstName}' Play date?`,
        action: async () => {
          await this.deleteChildren({
            playdateId: this.playdate.id,
            childId: this.child.id
          })

          this.$emit('deleted')
        }
      })
    }
  }
}
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

.description-text {
  line-clamp: none !important;
  -webkit-line-clamp: none;
  color: rgba(0, 0, 0, 0.6);
  line-height: 1.2;
  font-size: 0.875rem;
}

.custom-card-border {
  box-shadow: 0px 4px 14px rgba(0, 0, 0, 0.25) !important;
  border-radius: 8px !important;
}
</style>
