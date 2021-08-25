<template>
  <v-col class="fill-height">
    <v-row>
      <v-btn
        class="top-left text-none"
        color="#f89838"
        nuxt
        :to="{ name: 'app-playdates' }"
        text
        exact
      >
        <v-icon class="mr-2" small left color="#f89838">
          mdi-less-than
        </v-icon>
        Back
      </v-btn>
    </v-row>

    <v-row
      class="mt-0 mt-md-5"
      :class="{ mobile: $vuetify.breakpoint.smAndDown }"
    >
      <v-col cols="12" md="6">
        <v-row>
          <v-img
            alt="Educational Playdates"
            width="100%"
            height="90%"
            :src="require('@/assets/png/playdates/playdate.png')"
            class="align-center mr-md-15 mt-md-15 "
            data-test-id="create-playdate-image"
          />
        </v-row>
      </v-col>
      <v-col cols="12" md="6" class="pl-md-15 text--color-black-base">
        <underlined-title text="Invite a Friend to a Playdate!" />

        <p>
          Families can also choose to create <span class="font-weight-bold">Private Playdates</span> with their friends and family, which allows private time to connect and share.
        </p>

        <validation-observer v-slot="{ invalid, passes, reset }">
          <v-form @submit.prevent="passes(() => onSubmit(reset))">
            <v-row>
              <v-col>
                <p class="text-md-left text-sm-center font-weight-bold">
                  Who's this playdate for?
                </p>

                <!-- Child name -->
                <validation-provider
                  v-slot="{ errors }"
                  name="Child Select"
                  rules="required"
                >
                  <child-select
                    v-model="draft.childrenIds"
                    :error-messages="errors"
                    multiple
                  />
                </validation-provider>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <p class="text-md-left text-sm-center font-weight-bold">
                  Choose the day that best suits your child
                </p>

                <!-- Day -->
                <validation-provider
                  v-slot="{ errors }"
                  name="Day"
                  rules="required"
                >
                  <pg-select
                    v-model="day"
                    :disabled="loading"
                    :items="week"
                    :error-messages="errors"
                    label="Day"
                    :loading="loading"
                    solo
                    data-test-id="day-select"
                    @change="onWeekdayChange"
                  />
                </validation-provider>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <p class="text-md-left text-sm-center font-weight-bold">
                  Choose the time that best suits your child
                </p>

                <!-- Time -->
                <validation-provider
                  v-slot="{ errors }"
                  name="Time"
                  rules="required"
                >
                  <pg-select
                    v-model="playdateSelected"
                    :disabled="loading"
                    :items="times"
                    :error-messages="errors"
                    label="Time"
                    data-test-id="time-select"
                    :loading="loading"
                    solo
                  >
                    <template v-slot:selection="{ item }">
                      <span v-html="item.text" />
                    </template>

                    <template v-slot:item="{ item, on, attrs }">
                      <span
                        data-test-id="time-select-item"
                        v-bind="attrs"
                        v-on="on"
                        v-html="item.text"
                      />
                    </template>
                  </pg-select>
                </validation-provider>
              </v-col>
            </v-row>

            <v-row no-gutters justify="center" class="mt-3">
              <v-col>
                <p class="text-md-left text-sm-center font-weight-bold">
                  Want to invite your friends?
                </p>

                <small class="mb-2">Enter their email addresses or phone numbers to send them an invite.</small>

                <!-- Invite Friends -->
                <validation-provider
                  v-slot="{ errors }"
                  name="Invite Friends"
                  rules="required"
                >
                  <pg-autocomplete
                    v-model="draft.invites"
                    addable
                    chips
                    clearable
                    :error-messages="errors"
                    :disabled="loading"
                    :menu-props="feature"
                    deletable-chips
                    hide-no-data
                    data-test-id="invite-select"
                    :loading="loading"
                    multiple
                    solo
                  />
                </validation-provider>
              </v-col>
            </v-row>

            <v-row justify="center" no-gutters>
              <v-col cols="12" class="mb-5">
                <v-btn
                  block
                  class="text-transform-none white--text"
                  color="#68C453"
                  :disabled="invalid"
                  :loading="loading"
                  type="submit"
                  data-test-id="create-playdate-submit"
                  x-large
                >
                  Invite a Friend to a Playdate
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </validation-observer>
      </v-col>
    </v-row>
  </v-col>
</template>

<script lang="ts">
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import utc from 'dayjs/plugin/utc'

import { Child, Playdate, Playdates, TAG_MANAGER_EVENTS, TypedStore } from '@/models'
import { computed, defineComponent, onMounted, ref, useRouter, useStore } from '@nuxtjs/composition-api'
import { useGtmHelper, usePlaydates, useSnotifyHelper, useChild } from '@/composables'

import ChildSelect from '@/components/app/ChildSelect.vue'
import { number } from 'echarts'

const resetDraft = () => ({ childrenIds: [], invites: [], childId: 0 })
dayjs.extend(customParseFormat)
dayjs.extend(utc)

export default defineComponent({
  name: 'Create',

  components: {
    ChildSelect
  },

  setup () {
    const gtm = useGtmHelper()
    const snotify = useSnotifyHelper()
    const router = useRouter()
    const store = useStore<TypedStore>()

    const { getPlaydateDays, getChildrenInfo, getAndFilterPlaydates, addChildren } = usePlaydates()
    const { currentChildren } = useChild({ store })

    const loading = ref(false)
    const feature = ref({ top: true, offsetY: true })
    const draft = ref(resetDraft())
    const playdateSelected = ref<number | null>(null)
    const playdates = ref<Playdate[]>([])
    const activePlaydates = ref<{ children: Child; playdates: Playdates[] }[]>([])
    const week = ref<{ text: string, value: string }[]>([])
    const day = ref<string | null>(null)

    const userInfo = computed(() => store.getters['auth/getUserInfo'])

    const times = computed(() => {
      return playdates.value.map(({ id, start, end }) => {
        const startDate = dayjs.utc(start, 'HH:mm:ss').local()
        const endDate = dayjs.utc(end, 'HH:mm:ss').local()

        const startTime = startDate.format('hh:mm')
        const startMeridian = startDate.format('a')
        const endTime = endDate.format('hh:mm')
        const endMeridian = endDate.format('a')

        return {
          text: `${startTime} <small class="grey--text">${startMeridian}</small> - ${endTime} <small class="grey--text">${endMeridian}</small>`,
          value: id
        }
      })
    })

    const onWeekdayChange = async () => {
      loading.value = true

      try {
        if (day.value === null) {
          return
        }

        playdates.value = await getAndFilterPlaydates({
          day: day.value
        })

        playdateSelected.value = null
      } catch (e) {
      } finally {
        loading.value = false
      }
    }

    const resetForm = (reset: () => void) => {
      draft.value = resetDraft()
      day.value = null
      playdates.value = []
      playdateSelected.value = null
      reset()
    }

    const onSubmit = async (reset: () => void) => {
      loading.value = true

      try {
        if (playdateSelected.value === null) {
          return
        }
        draft.value.childId = (currentChildren.value) ? currentChildren.value[0].id : 0
        playdates.value = await addChildren({
          id: playdateSelected.value,
          data: draft.value
        })

        resetForm(reset)

        gtm.push({
          event: TAG_MANAGER_EVENTS.PLAYDATE_INVITE_FRIEND,
          userId: userInfo.value.id
        })

        snotify.success('Your Playdate has been stored successfully!.')
        router.push({ name: 'app-playdates' })
      } catch (e) {
      } finally {
        loading.value = false
      }
    }

    const getActivePlaydates = async () => {
      try {
        loading.value = true
        activePlaydates.value = await getChildrenInfo()
      } catch (error) {

      } finally {
        loading.value = false
      }
    }

    onMounted(async () => {
      const days = await getPlaydateDays()
      week.value = days.days.map((day) => {
        return { text: day, value: day }
      })

      await getActivePlaydates()
    })

    return {
      feature,
      loading,
      draft,
      week,
      day,
      playdates,
      userInfo,
      activePlaydates,
      times,
      playdateSelected,
      resetForm,
      getActivePlaydates,
      onWeekdayChange,
      onSubmit,
      currentChildren
    }
  }
})
</script>

<style lang="scss" scoped>
.text--color-black-base{
  color:var(--v-black-base);
}
</style>
