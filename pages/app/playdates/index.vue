<template>
  <v-main>
    <v-col>
      <v-row
        class="mt-n15"
        :class="{ mobile: $vuetify.breakpoint.smAndDown }"
        no-gutters
      >
        <v-col cols="12" class="text-md-left text-center">
          <underlined-title text="Educational Playdates" class="text-h5" />

          <v-col>
            <v-row justify="end" no-gutters class="ml-16">
              <div class="text-center mt-n16 ml-16 mr-n16">
                <v-btn
                  v-if="hasPlaydates"
                  nuxt
                  :to="{ name: 'app-playdates-create' }"
                  large
                  color="accent"
                  class="text-btn hidden-sm-and-down"
                >
                  Create Playdate
                </v-btn>

                <v-btn
                  large
                  nuxt
                  :to="{ name: 'app-playdates-find' }"
                  color="primary"
                  class="text-btn  hidden-sm-and-down"
                >
                  Find Playdate
                </v-btn>
              </div>
            </v-row>
          </v-col>

          <v-container v-if="hasPlaydates" fluid>
            <v-row dense>
              <v-col
                v-for="(playdate, indexP) in playdates"
                :key="indexP"
                cols="12"
                md="6"
              >
                <card-playdate :playdate="playdate" />
              </v-col>
            </v-row>
          </v-container>

          <v-row v-else no-gutters class="mt-md-10">
            <v-col>
              <v-row
                class="mt-6 mt-md-0"
                :class="{ mobile: $vuetify.breakpoint.smAndDown }"
                no-gutters
              >
                <v-col cols="12" md="6" sm="12">
                  <v-img
                    contain
                    alt="Educational Playdates"
                    :src="require('assets/png/playdates/playdate.png')"
                    class="align-center mr-md-15"
                  />
                </v-col>

                <v-col cols="12" md="6" sm="12">
                  <v-row
                    justify-sm="center"
                    justify-md="start"
                    no-gutters
                    class="mt-10"
                  >
                    <v-col>
                      <p class="text-md-left text-sm-center font-weight-bold">
                        What's a Playdates?
                      </p>
                    </v-col>
                  </v-row>

                  <v-row justify-sm="center" justify-md="start" no-gutters>
                    <v-col sm="12">
                      <p class="text-md-left text-sm-center">
                        A playdate is a place where your child can have fun with
                        their friends while they have fun playing, all
                        supervised by a specialist.
                      </p>
                    </v-col>
                  </v-row>

                  <v-row justify="center" no-gutters>
                    <v-col>
                      <v-btn
                        nuxt
                        :to="{ name: 'app-playdates-create' }"
                        large
                        color="accent"
                        class="text-btn hidden-sm-and-down"
                      >
                        Create Playdate
                      </v-btn>
                    </v-col>
                  </v-row>

                  <v-row justify-sm="center" no-gutters>
                    <v-col>
                      <v-row justify="center" no-gutters>
                        <v-btn
                          nuxt
                          :to="{ name: 'app-playdates-create' }"
                          width="200"
                          large
                          color="accent"
                          class="text-btn hidden-md-and-up "
                        >
                          Create Playdate
                        </v-btn>
                      </v-row>

                      <v-row justify="center" no-gutters>
                        <v-btn
                          nuxt
                          :to="{ name: 'app-playdates-find' }"
                          width="200"
                          large
                          color="primary"
                          class="text-btn hidden-md-and-up mb-5 mt-5"
                        >
                          Find Playdate
                        </v-btn>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>

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

              <v-col cols="12" md="7" sm="12" class="mt-md-15 mt-sm-0">
                <v-row justify="center" no-gutters>
                  <v-col cols="12">
                    <v-row
                      :class="{ mobile: $vuetify.breakpoint.smAndDown }"
                      no-gutters
                    >
                      <v-col cols="12" class="text-md-left text-center">
                        <underlined-title
                          text="What's a Playdate?"
                          class="text-h5 ml-sm-0 ml-md-5"
                        />

                        <v-row
                          justify-sm="center"
                          justify-md="start"
                          no-gutters
                        >
                          <v-col sm="12">
                            <v-row
                              justify-sm="center"
                              justify-md="start"
                              no-gutters
                            >
                              <p
                                class="text-md-left text-sm-center mt-5 mr-md-5 ml-md-5"
                              >
                                A playdate is a place where your child can have
                                fun with their friends while they have fun
                                playing, all supervised by a specialist.
                              </p>
                            </v-row>

                            <v-row
                              justify-sm="center"
                              justify-md="start"
                              no-gutters
                            >
                              <v-col cols="12">
                                <p
                                  class="text-md-left text-sm-center mt-5 font-weight-bold ml-md-5"
                                >
                                  Get access to Educationals Playdates
                                </p>
                              </v-col>
                            </v-row>

                            <v-row
                              justify-sm="center"
                              justify-md="start"
                              no-gutters
                            >
                              <v-col sm="12">
                                <p
                                  class="text-md-left text-sm-center mt-5 ml-md-5"
                                >
                                  Upgraded your plan
                                </p>
                              </v-col>
                            </v-row>

                            <v-row
                              justify-sm="center"
                              justify-md="start"
                              no-gutters
                            >
                              <v-col sm="12">
                                <v-btn
                                  color="accent"
                                  class="hidden-md-and-up mb-5"
                                  tile
                                  large
                                  nuxt
                                  :to="{
                                    name: 'app-account',
                                    params: { changeplan: 1 }
                                  }"
                                >
                                  <!-- nuxt to app-account ?changeplan=1 -->
                                  COMPARE PLANS
                                </v-btn>

                                <v-btn
                                  color="accent"
                                  class="hidden-sm-and-down ml-md-5"
                                  tile
                                  x-large
                                  nuxt
                                  :to="{
                                    name: 'app-account',
                                    params: { changeplan: 1 }
                                  }"
                                >
                                  <!-- nuxt to app-account ?changeplan=1 -->
                                  COMPARE PLANS
                                </v-btn>
                              </v-col>
                            </v-row>
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
      </v-row>
    </v-col>
  </v-main>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import CardPlaydate from '@/components/app/playdates/CardPlaydate'

export default {
  name: 'Index',

  components: {
    CardPlaydate
  },

  data: () => ({ playdates: [] }),

  computed: {
    ...mapGetters('auth', ['hasTrialOrPlatinumPlan']),

    hasPlaydates () {
      return Boolean(this.playdates.length)
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
      try {
        this.playdates = await this.getChildrenInfo()
      } catch (e) {}
    }
  }
}
</script>

<style lang="scss" scoped>
.text-btn {
  text-transform: none !important;
}
.dialog-overlay {
  background-color: rgba(0, 0, 0, 0.68) !important;
}
.fullscreen {
  width: 100% !important;
  height: 100% !important;
}
</style>
