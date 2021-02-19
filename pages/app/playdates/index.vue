<template>
  <v-col class="fill-height">
    <v-row no-gutters>
      <v-col cols="12" sm="">
        <center v-if="$vuetify.breakpoint.smAndDown">
          <underlined-title class="text-h5" text="Educational Playdates" />
        </center>
        <underlined-title v-else text="Educational Playdates" />
      </v-col>

      <v-col cols="12" sm="auto" class="mt-3 mt-sm-0">
        <v-row
          class="fill-height"
          align-content="center"
          justify="end"
          no-gutters
        >
          <div :class="{ 'hidden-sm-and-down': !hasPlaydates }">
            <v-btn
              v-if="hasPlaydates"
              class="text-transform-none mr-3"
              color="accent"
              dark
              :fab="$vuetify.breakpoint.smAndDown"
              :large="$vuetify.breakpoint.mdAndUp"
              nuxt
              :to="{ name: 'app-playdates-create' }"
              :small="$vuetify.breakpoint.smAndDown"
            >
              <template v-if="$vuetify.breakpoint.mdAndUp">
                Create Playdate
              </template>

              <v-icon v-else>
                mdi-plus
              </v-icon>
            </v-btn>

            <v-btn
              large
              nuxt
              :to="{ name: 'app-playdates-find' }"
              color="primary"
              class="text-transform-none"
            >
              Find Playdate
            </v-btn>
          </div>
        </v-row>
      </v-col>
    </v-row>

    <v-row v-if="hasPlaydates" class="mt-6" dense>
      <v-col
        v-for="(playdate, indexP) in playdatesComputed"
        :key="indexP"
        class="mb-3"
        cols="12"
        md="6"
      >
        <card-playdate :playdate="playdate" @deleted="getActivePlaydates" />
      </v-col>
    </v-row>

    <v-row v-else class="mt-6 mt-md-0">
      <v-col cols="12" md="6">
        <v-img
          alt="Educational Playdates"
          class="align-center mr-md-15"
          contain
          :max-height="($vuetify.breakpoint.smAndDown) ? 200 : 500"
          :src="require('@/assets/png/playdates/playdate.png')"
        />
      </v-col>

      <v-col cols="12" md="6">
        <v-row align-content="center" class="fill-height">
          <v-col cols="12" class="text-md-left text-md-h5 text-center font-weight-bold">
            What's a Playdates?
          </v-col>

          <v-col cols="12" class="text-md-left text-center">
            <p class="text-justify">
              Playgarden Prep has created custom virtual Playdates to provide important social opportunities for children to interact with their friends and family during this time of isolation.
            </p>

            <p class="text-justify">
              Our <span class="font-weight-bold">Educational Playdates</span> are moderated by a specialist in speech and occupational therapy, to ensure children engage and enjoy social interactions with other little ones. We will limit the number of children in each playdate to allow everyone to participate and benefit from these structured playtimes.
            </p>

            <p class="text-justify">
              Our <span class="font-weight-bold">Musical Playdates</span> are structured around music and engage little ones through a Mommy and Me class experience. Led by our Coaches, these playdates are a natural way for children to get together with their friends to sing, dance and have fun together!
            </p>

            <p class="text-justify">
              Families can also choose to create <span class="font-weight-bold">Private Playdates</span> with their friends and family, which allows private time to connect and share.
            </p>

            <p class="text-justify">
              Whether you choose to book a Private Playdate or join a recurring Educational or Musical Playdate to make new friends, we are committed to keeping children connected!
            </p>
          </v-col>

          <v-col cols="12">
            <v-row justify="center" justify-md="start" no-gutters>
              <v-btn
                nuxt
                :to="{ name: 'app-playdates-create' }"
                width="200"
                large
                :loading="loading"
                color="accent"
                class="text-transform-none"
              >
                Create Playdate
              </v-btn>
            </v-row>

            <v-row class="hidden-md-and-up" justify="center" no-gutters>
              <v-btn
                nuxt
                :to="{ name: 'app-playdates-find' }"
                width="200"
                large
                color="primary"
                class="my-5 text-transform-none"
              >
                Find Playdate
              </v-btn>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- PlatinumPlan Popup -->
    <v-dialog
      :value="!hasTrialOrPlatinumPlan"
      content-class="elevation-0"
      max-width="700"
      persistent
    >
      <v-card>
        <div class="green-line green-line-1" />
        <div class="green-line green-line-2" />

        <v-row justify="center" align-content="center" no-gutters>
          <v-col cols="5">
            <v-img
              :src="require('assets/png/playdates/playdate-1.png')"
              class="hidden-sm-and-down"
            />
          </v-col>

          <v-col cols="12" class="hidden-md-and-up">
            <v-row justify="center" no-gutters>
              <v-img
                max-width="250"
                :src="require('assets/png/playdates/popup.png')"
                class="hidden-md-and-up mt-5"
              />
            </v-row>
          </v-col>

          <v-col cols="12" md="7">
            <v-row align-content="center" class="fill-height" no-gutters>
              <v-col cols="12" class="text-md-left text-center">
                <underlined-title
                  text="What's a Playdate?"
                  class="text-h5 ml-sm-0 ml-md-5"
                />

                <v-row justify="center" justify-md="start" no-gutters>
                  <v-col class="pt-8 px-5" cols="12">
                    <v-row no-gutters>
                      A playdate is a place where your child can have fun with
                      their friends while they have fun playing, all supervised
                      by a specialist.
                    </v-row>

                    <v-row class="pt-8 font-weight-bold" no-gutters>
                      Get access to Educationals Playdates
                    </v-row>

                    <v-row no-gutters class="pt-8">
                      <v-col>
                        Upgraded your plan
                      </v-col>
                    </v-row>

                    <v-row
                      justify="center"
                      justify-md="start"
                      class="pt-8"
                      no-gutters
                    >
                      <v-col cols="12">
                        <v-btn
                          color="accent"
                          class="hidden-md-and-up mb-5 text-transform-none"
                          large
                          nuxt
                          :to="{
                            name: 'app-account',
                            params: { changeplan: 1 }
                          }"
                        >
                          <!-- nuxt to app-account ?changeplan=1 -->
                          Compare Plans
                        </v-btn>

                        <v-btn
                          color="accent"
                          class="hidden-sm-and-down text-transform-none"
                          width="200"
                          large
                          nuxt
                          :to="{
                            name: 'app-account',
                            params: { changeplan: 1 }
                          }"
                        >
                          <!-- nuxt to app-account ?changeplan=1 -->
                          Compare Plans
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </v-col>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import CardPlaydate from '@/components/app/playdates/CardPlaydate'

export default {
  name: 'Index',

  components: {
    CardPlaydate
  },

  data: () => ({
    loading: false,

    playdates: []
  }),

  computed: {
    ...mapGetters('auth', ['hasTrialOrPlatinumPlan']),

    playdatesComputed () {
      return this.playdates
        .filter(item => (item.playdates || []).length)
        .flatMap(({ backpackChildrenImages = [], children, playdates }) => {
          return playdates.map(({ playdate, backpackImages }, indexP) => {
            if (!playdate) {
              return null
            }

            return {
              backpackImages,
              children,
              ...playdate
            }
          })
        })
    },

    hasPlaydates () {
      return Boolean(this.playdatesComputed.length)
    }
  },

  mounted () {
    if (this.hasTrialOrPlatinumPlan) {
      this.getActivePlaydates()
    } else {
      setTimeout(this.getActivePlaydates, 500)
    }
  },

  methods: {
    ...mapActions('playdates', ['getChildrenInfo']),

    async getActivePlaydates () {
      this.loading = true

      try {
        this.playdates = await this.getChildrenInfo()
      } catch (e) {
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
