<template>
  <v-col class="fill-height">
    <!-- ACTIVE PLAYDATES -->
    <div v-if="isPayingUser">
      <v-row align="center" class="fill-height" justify="space-between">
        <!-- HEADER -->
        <v-col cols="12" md="auto" class="flex-grow-1">
          <underlined-title
            text="Educational Playdates"
            font-size="36px"
          />
        </v-col>

        <!-- BUTTON -->
        <v-col cols="12" md="auto" class="flex-shrink-1">
          <v-btn color="accent">
            MY PLAYDATES
          </v-btn>
        </v-col>

        <v-container>
          <!-- PAGE DESCRIPTION -->
          <p class="body-1">
            Join your friends and socialize at a Playgarden Prep Online Playdate!
            These 30 minute Zoom sessions are designed to give children the opportunity to connect with peers while learning under the guidance of a Playgarden Prep instructor.
            You can sign up for up to one Playdate per week; make sure to sign up for the same weekly Playdate, so that you can see your friends every week!
          </p>

          <!-- WEEK NAVIGATOR -->

          <!-- WEEK'S PLAYDATES -->
        </v-container>
      </v-row>
    </div>

    <!-- PAYWALL -->
    <paywall v-else />

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
import { Child, Playdates, TypedStore } from '@/models'

import CardPlaydate from '@/components/app/playdates/CardPlaydate.vue'
import PlaydatesAreBack from '@/components/app/playdates/PlaydatesAreBack.vue'
import { usePlaydates } from '@/composables'

export default defineComponent({
  name: 'Index',

  components: {
    CardPlaydate,
    PlaydatesAreBack,
    Paywall: () => import('@/components/app/playdates/Paywall.vue')
  },

  setup () {
    const store = useStore<TypedStore>()
    const { isPayingUser, getChildrenInfo } = usePlaydates({ store })

    const loading = ref(false)
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
      isPayingUser,
      loading,
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
