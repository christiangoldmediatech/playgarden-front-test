<template>
  <v-col class="fill-height">
    <div v-if="isActive">
      <v-container v-if="loading" fill-height fluid>
        <pg-loading />
      </v-container>

      <v-container v-else>
        <v-row no-gutters>
          <v-col cols="12" md="">
            <center v-if="$vuetify.breakpoint.smAndDown">
              <underlined-title class="text-h5" text="Educational Playdates" />
            </center>
            <underlined-title v-else text="Educational Playdates" />
          </v-col>

          <v-col cols="12" md="auto" class="mt-3">
            <v-row
              v-if="playdatesComputed.length > 0"
              class="fill-height"
              align-content="center"
              justify-md="end"
              justify="center"
              no-gutters
            >
              <template v-if="!allChildrenHavePlaydates">
                <v-btn
                  class="text-transform-none mr-3"
                  color="accent"
                  dark
                  :fab="$vuetify.breakpoint.smAndDown"
                  :large="$vuetify.breakpoint.mdAndUp"
                  nuxt
                  :to="{ name: 'app-playdates-create' }"
                  :small="$vuetify.breakpoint.smAndDown"
                  data-test-id="create-playdate"
                >
                  <template v-if="$vuetify.breakpoint.mdAndUp">
                    Invite a Friend to a Playdate
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
                  data-test-id="find-playdates"
                >
                  Find Playdates
                </v-btn>
              </template>

              <template v-else>
                <div class="grey--text text--darken-2">
                  * You can only have one playdate per week per child.
                </div>
              </template>
            </v-row>
          </v-col>
        </v-row>

        <v-row v-if="hasPlaydates" class="mt-6" dense>
          <v-col cols="12" class="mb-6">
            Our <span class="grey--text text--darken-2 font-weight-bold">Educational Playdates</span> are moderated by a specialist in speech and occupational therapy, to
            ensure children engage and enjoy social interactions with others little ones. We will limit the number of children in each playdate to allow everyone to
            participate and benefit from these structured playtimes.
          </v-col>
          <v-col
            v-for="(playdate, indexP) in playdatesComputed"
            :key="indexP"
            :class="{
              'pb-6': true,
              'pr-md-3': indexP % 2 === 0,
              'pl-md-3': indexP % 1 === 0
            }"
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
                What are Playdates?
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

              <v-col cols="10" offset="1">
                <v-row justify="center" justify-md="start" no-gutters>
                  <v-col cols="12" md="6">
                    <v-btn
                      nuxt
                      :to="{ name: 'app-playdates-create' }"
                      width="200"
                      large
                      :loading="loading"
                      color="accent"
                      class="text-transform-none"
                    >
                      Create a Playdate
                    </v-btn>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-btn
                      nuxt
                      :to="{ name: 'app-playdates-find' }"
                      width="200"
                      large
                      color="primary"
                      class="my-md-0 my-5 text-transform-none"
                    >
                      Find a Playdate
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <div v-else>
      <will-be-back />
    </div>

    <!-- PlatinumPlan Popup -->
    <pg-dialog
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
                            name: 'app-account-index',
                            params: { changeplan: 1 }
                          }"
                        >
                          <!-- nuxt to app-account-index ?changeplan=1 -->
                          Compare Plans
                        </v-btn>

                        <v-btn
                          color="accent"
                          class="hidden-sm-and-down text-transform-none"
                          width="200"
                          large
                          nuxt
                          :to="{
                            name: 'app-account-index',
                            params: { changeplan: 1 }
                          }"
                        >
                          <!-- nuxt to app-account-index ?changeplan=1 -->
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
    </pg-dialog>
  </v-col>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, useStore } from '@nuxtjs/composition-api'
import { Child, Playdates } from '@/models'

import CardPlaydate from '@/components/app/playdates/CardPlaydate.vue'
import WillBeBack from '@/components/app/playdates/WillBeBack.vue'
import { usePlaydates } from '@/composables'

export default defineComponent({
  name: 'Index',

  components: {
    CardPlaydate,
    WillBeBack
  },

  setup () {
    const store = useStore()

    const { getChildrenInfo } = usePlaydates()
    const loading = ref(false)
    const isActive = ref(false)
    const playdates = ref<{ children: Child, playdates: Playdates[] }[]>([])

    onMounted(() => {
      if (hasTrialOrPlatinumPlan.value) {
        getActivePlaydates()
      } else {
        setTimeout(() => {
          getActivePlaydates()
        }, 500)
      }
    })

    const hasTrialOrPlatinumPlan = computed(() => store.getters['auth/hasTrialOrPlatinumPlan'])

    const playdatesComputed = computed(() => {
      return playdates.value
        .filter(item => item.playdates?.length > 0)
        .flatMap(({ children, playdates }) => {
          return playdates.map(({ playdate, backpackImages }) => {
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
    })

    const hasPlaydates = computed(() => playdatesComputed.value.length > 0)

    const allChildrenHavePlaydates = computed(() => playdates.value.every(playdate => Array.isArray(playdate.playdates) && playdate.playdates.length > 0))

    const getActivePlaydates = async () => {
      try {
        loading.value = true
        const response = await getChildrenInfo()

        if (response) {
          playdates.value = response
        }
      } catch (error) {

      } finally {
        loading.value = false
      }
    }

    return {
      loading,
      isActive,
      playdates,
      hasTrialOrPlatinumPlan,
      allChildrenHavePlaydates,
      hasPlaydates,
      playdatesComputed,
      getActivePlaydates
    }
  }
})
</script>

<style lang="scss" scoped></style>
