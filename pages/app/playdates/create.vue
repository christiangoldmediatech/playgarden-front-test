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
          />
        </v-row>
      </v-col>

      <v-col cols="12" md="6" class="pl-md-15">
        <underlined-title text="Create Playdate!" />

        <p>
          Families can also choose to create <span class="font-weight-bold">Private Playdates</span> with their friends and family, which allows private time to connect and share.
        </p>

        <validation-observer v-slot="{ invalid, passes, reset }">
          <v-form @submit.prevent="passes(onSubmit(reset))">
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
                    :playdates="activePlaydates"
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
                    :loading="loading"
                    solo
                  >
                    <template v-slot:selection="{ item }">
                      <span v-html="item.text" />
                    </template>

                    <template v-slot:item="{ item, on, attrs }">
                      <span v-bind="attrs" v-on="on" v-html="item.text" />
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
                    deletable-chips
                    hide-no-data
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
                  color="#C2DAA5"
                  :disabled="invalid"
                  :loading="loading"
                  type="submit"
                  x-large
                >
                  Create Playdate
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </validation-observer>
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
import { mapActions } from 'vuex'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import utc from 'dayjs/plugin/utc'

import ChildSelect from '@/components/app/ChildSelect.vue'

const resetDraft = () => ({ childrenIds: [], invites: [] })
dayjs.extend(customParseFormat)
dayjs.extend(utc)

export default {
  name: 'Create',

  components: {
    ChildSelect
  },

  data: () => ({
    draft: resetDraft(),
    day: null,
    playdates: [],
    activePlaydates: [],
    childrenPlaydates: [],
    playdateSelected: null,

    loading: false,

    week: []
  }),

  computed: {
    times () {
      return this.playdates.map(({ id, start, end }) => {
        start = dayjs.utc(start, 'HH:mm:ss').local()
        end = dayjs.utc(end, 'HH:mm:ss').local()

        const startTime = start.format('hh:mm')
        const startMeridian = start.format('a')
        const endTime = end.format('hh:mm')
        const endMeridian = end.format('a')

        return {
          text: `${startTime} <small class="grey--text">${startMeridian}</small> - ${endTime} <small class="grey--text">${endMeridian}</small>`,
          value: id
        }
      })
    }
  },

  async created () {
    const days = await this.getPlaydateDays()
    this.week = days.days.map((day) => {
      return { text: day, value: day }
    })

    await this.getActivePlaydates()
  },

  methods: {
    ...mapActions('playdates', ['addChildren', 'getAndFilterPlaydates', 'getPlaydateDays', 'getChildrenInfo']),

    async onWeekdayChange () {
      this.loading = true

      try {
        this.playdates = await this.getAndFilterPlaydates({
          day: this.day
        })

        this.playdateSelected = null
      } catch (e) {
      } finally {
        this.loading = false
      }
    },

    async onSubmit (reset) {
      this.loading = true

      try {
        this.playdates = await this.addChildren({
          id: this.playdateSelected,
          data: this.draft
        })

        this.resetForm(reset)

        this.$snotify.success('Your Playdate has been stored successfully!.')
        this.$router.push({ name: 'app-playdates' })
      } catch (e) {
      } finally {
        this.loading = false
      }
    },

    resetForm (reset) {
      this.draft = resetDraft()
      this.day = null
      this.playdates = []
      this.playdateSelected = null
      reset()
    },

    async getActivePlaydates () {
      this.loading = true

      try {
        this.activePlaydates = await this.getChildrenInfo()
      } catch (e) {
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
