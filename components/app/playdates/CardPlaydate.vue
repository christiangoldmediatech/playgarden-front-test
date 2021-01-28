<template>
  <v-card
    class="mx-auto"
    :elevation="joining ? 0 : 2"
    :max-width="joining ? '100%' : 500"
    tile
  >
    <v-row justify="center" no-gutters>
      <v-col md="5" cols="12" class="align-self-center">
        <v-row justify="center" no-gutters>
          <v-col class="py-2">
            <div>
              <v-img
                alt="Educational Playdates"
                contain
                :max-height="joining ? 500 : 120"
                :src="require('@/assets/png/playdates/playdate.png')"
              />
            </div>

            <h5 v-if="!joining" class="text-capitalize text-center mt-2">
              {{ day }} <span v-html="start" />
            </h5>
          </v-col>
        </v-row>
      </v-col>

      <v-col class="py-3" md="7" cols="12">
        <v-row align-content="center" class="fill-height" no-gutters>
          <v-col>
            <v-list-item three-line>
              <v-list-item-content>
                <div
                  v-if="child.firstName && !finding"
                  class="headline pb-2 font-weight-bold"
                >
                  <template v-if="!joining">
                    {{ child.firstName | belongsTo }}
                  </template>

                  <template v-else>
                    {{ child.firstName }}
                  </template>

                  {{ joining ? "has invited you to a playdate!" : "Playdate" }}
                </div>

                <v-list-item-title class="overline pb-1">
                  <template v-if="specialist">
                    With {{ specialist.fullName }}
                  </template>

                  <span v-if="joining" class="text-capitalize">
                    {{ day }} <span v-html="start" />
                  </span>
                </v-list-item-title>

                <v-list-item-subtitle v-if="!joining" class="pt-3">
                  JOIN YOUR FRIENDS!

                  <v-row
                    align-content="center"
                    justify="center"
                    justify-md="start"
                    no-gutters
                    class="pt-2"
                  >
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

                <v-list-item-subtitle class="py-1">
                  Ages recommended:<b> {{ playdate.ages || "All ages" }}</b>
                </v-list-item-subtitle>

                <v-list-item-subtitle class="py-1">
                  Duration: <b>{{ duration || "30" }} minutes</b>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <slot name="button">
              <v-row justify="center" no-gutters>
                <v-btn
                  class="white--text text-transform-none"
                  color="accent"
                  width="250"
                  large
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
    <v-dialog
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

                      <v-list-item-title
                        v-if="specialist"
                        class="overline pb-1"
                      >
                        With {{ specialist.fullName }}
                      </v-list-item-title>

                      <v-list-item-subtitle class="pt-3">
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

              <v-row justify="center" no-gutters>
                <v-col cols="8" class="mb-5 mt-3">
                  <v-btn
                    class="white--text"
                    color="accent"
                    target="_blank"
                    block
                    x-large
                    :href="playdate.link"
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
    </v-dialog>
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
    }
  },

  methods: {
    ...mapActions('playdates', ['deleteChildren']),

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
</style>
