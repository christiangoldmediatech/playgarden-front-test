<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-title>
            {{ specialistName || "Specialist" }}’s play date
            <v-spacer />
            <v-btn
              class="text-none"
              color="accent darken-1"
              depressed
              nuxt
              small
              :to="getUrlBack"
            >
              Back
            </v-btn>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-text>
            <v-col>
              <v-row>
                <v-col cols="12">
                  <h2>
                    <b>
                      {{ playdate.day }},
                      {{ times.start.format("HH:mm a") }}
                      -
                      {{ times.end.format("HH:mm a") }}
                    </b>
                  </h2>
                </v-col>
              </v-row>
              <v-row align-content="center">
                <!-- COL1-->
                <v-col cols="12" md="6">
                  <h3 class="mt-6">
                    General Information
                  </h3>
                  <v-row class="mt-5" no-gutters>
                    <v-col cols="6" class="mt-6">
                      <span class="subheader">Spots:</span>
                    </v-col>
                    <v-col cols="6" class="mt-6">
                      <b>{{ playdatesChildrens.length }}/{{ playdate.spots }}
                      </b>
                    </v-col>
                  </v-row>

                  <v-row class="mt-5" no-gutters>
                    <v-col cols="6">
                      <span class="subheader">Ages Recommended:</span>
                    </v-col>
                    <v-col cols="6">
                      <b>{{ playdate.ages }} </b>
                    </v-col>
                  </v-row>

                  <v-row class="mt-5" no-gutters>
                    <v-col cols="6">
                      <span class="subheader">Duration:</span>
                    </v-col>
                    <v-col cols="6">
                      <b>{{ duration }} minutes </b>
                    </v-col>
                  </v-row>

                  <v-row class="mt-5" no-gutters>
                    <v-col cols="6">
                      <span class="subheader">Date:</span>
                    </v-col>
                    <v-col cols="6">
                      <span>
                        <b>{{
                          playdate.createdAt
                            | formatDate({ format: "MMMM DD, YYYY" })
                        }}</b></span>
                    </v-col>
                  </v-row>

                  <v-row
                    align-content="center"
                    justify="center"
                    justify-md="start"
                    no-gutters
                    class="pt-2"
                  >
                    <p />
                  </v-row>

                  <v-row class="mt-5" no-gutters>
                    <v-col cols="6">
                      <span class="subheader">Zoom Link: </span>
                    </v-col>
                    <v-col cols="6">
                      <v-btn
                        class="white--text"
                        color="accent"
                        medium
                        :href="playdate.link"
                      >
                        Join Play date
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-col>
                <!-- END COL1 -->
                <!-- COL2-->
                <v-col cols="12" md="6">
                  <v-row gutters>
                    <v-col cols="12" md="3" class="mr-md-n4 mt-md-3 mt-0 mr-0">
                      <p>Who's going?</p>
                    </v-col>

                    <v-col cols="12" md="9" class="mt-md-1 mt-0 mr-0">
                      <v-row justify-md="start" no-gutters class="pt-2 pl-n6">
                        <v-col
                          v-for="(show, Index) in playdatesChildrens"
                          :key="Index"
                          :class="{ 'ml-n3': index }"
                          cols="6"
                        >
                          <v-row no-gutters class="pl-1" align-content="center">
                            <v-img
                              max-width="30"
                              :src="show.children.backpack.image"
                            />

                            <span class="pt-1">
                              <strong class="pl-2">
                                {{ show.children.fullName }}</strong>
                            </span>
                          </v-row>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-col>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import { formatDate } from '~/utils/dateTools'

function generatePlaydateTemplate () {
  return {
    id: null,
    name: '',
    description: '',
    duration: '',
    day: null,
    start: null,
    end: null,
    ages: null,
    spots: null,
    link: null,
    specialistId: null,
    specialistName: null,
    createdAt: null,
    firstName: null
  }
}

export default {
  name: 'List',

  layout: 'admin',

  data: vm => ({
    specialistId: vm.$route.query.specialistId
      ? parseInt(vm.$route.query.specialistId)
      : null,
    loading: true,
    time: null,
    ages: null,
    menuStart: false,
    specialistName: null,
    index: null,
    playdatesChildrens: [],
    menuEnd: false,
    playdate: generatePlaydateTemplate()
  }),

  computed: {
    ...mapGetters('auth', {
      userInfo: 'getUserInfo'
    }),

    getUrlBack () {
      const url = {
        name: 'admin-playdates'
      }
      if (this.userInfo.role.name === 'SUPER_ADMINISTRATORS') {
        url.query = { specialistId: this.specialistId }
      }
      return url
    },

    duration () {
      return this.times.end.diff(this.times.start, 'm')
    },

    times () {
      const start = formatDate(this.playdate.start, {
        format: 'HH:mm a',
        fromFormat: 'HH:mm:ss',
        fromUtc: true,
        returnObject: true
      })
      const end = formatDate(this.playdate.end, {
        format: 'HH:mm a',
        fromFormat: 'HH:mm:ss',
        fromUtc: true,
        returnObject: true
      })

      return {
        start,
        end
      }
    }
  },

  async created () {
    this.loading = true
    this.playdate.specialistId =
      this.userInfo.role.name === 'SPECIALISTS'
        ? this.userInfo.specialists.id
        : this.specialistId

    if (this.specialistId) {
      const data = await this.getPlaydatesById(this.specialistId)

      if (data) {
        this.playdate.id = data.id
        this.playdate.name = data.name
        this.playdate.ages = data.ages
        this.playdate.description = data.description
        this.playdate.duration = data.duration
        this.playdate.day = data.day
        this.playdate.start = data.start
        this.playdate.end = data.end
        this.playdate.spots = data.spots
        this.playdate.link = data.link
        this.playdate.createdAt = data.createdAt
        this.playdate.specialistId = data.specialistUser.id
        this.specialistId = data.specialistUser.id
        this.specialistName = data.specialistUser.user.firstName
        this.playdatesChildrens = data.playdatesChildrens
      }
    }
  },

  methods: {
    ...mapActions('playdate', ['getPlaydatesById'])
  }
}
</script>
