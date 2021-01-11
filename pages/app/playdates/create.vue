<template>
  <v-col class="fill-height">
    <v-row
      class="mt-0 mt-md-0"
      :class="{ mobile: $vuetify.breakpoint.smAndDown }"
      no-gutters
    >
      <v-col cols="12" md="6" sm="12">
        <v-img
          alt="Educational Playdates"
          :src="require('@/assets/png/playdates/playdate.png')"
          class="align-center mr-md-15"
        />
      </v-col>

      <v-col cols="12" md="6" sm="12">
        <underlined-title text="Create Playdate!" />

        <p>You just can create or join one playdate per week</p>

        <v-row>
          <v-col>
            <p class="text-md-left text-sm-center font-weight-bold">
              Who's this playdate for?
            </p>

            <child-select v-model="draft.childrenIds" hide-details multiple />
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <p class="text-md-left text-sm-center font-weight-bold">
              Choose the day that best suits your child
            </p>

            <pg-select
              v-model="day"
              :disabled="loading"
              :items="week"
              label="Day"
              :loading="loading"
              solo
              @change="onWeekdayChange"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <p class="text-md-left text-sm-center font-weight-bold">
              Choose the time that best suits your child
            </p>

            <pg-select
              v-model="playdateSelected"
              :disabled="loading"
              :items="times"
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
          </v-col>
        </v-row>

        <v-row no-gutters justify="center" class="mb-8">
          <v-col>
            <p class="text-md-left text-sm-center font-weight-bold">
              Invite friends
            </p>

            <pg-autocomplete
              v-model="draft.invites"
              addable
              chips
              clearable
              :disabled="loading"
              deletable-chips
              hide-no-data
              :loading="loading"
              multiple
              solo
            />
          </v-col>
        </v-row>

        <v-row justify="center" no-gutters>
          <v-col cols="12" class="mb-5">
            <v-btn
              block
              class="text-transform-none white--text"
              color="#C2DAA5"
              :disabled="loading"
              :loading="loading"
              x-large
              @click="onSubmit"
            >
              Create Playdate
            </v-btn>
          </v-col>
        </v-row>
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
    playdateSelected: null,

    loading: false,

    week: [
      { text: 'Monday', value: 'MONDAY' },
      { text: 'Tuesday', value: 'TUESDAY' },
      { text: 'Wednesday', value: 'WEDNESDAY' },
      { text: 'Thursday', value: 'THURSDAY' },
      { text: 'Friday', value: 'FRIDAY' }
    ]
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

  methods: {
    ...mapActions('playdates', ['addChildren', 'getAndFilterPlaydates']),

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

    async onSubmit () {
      this.loading = true

      try {
        this.playdates = await this.addChildren({
          id: this.playdateSelected,
          data: this.draft
        })

        this.reset()

        this.$snotify.success('Your Playdate has been stored successfully!.')
      } catch (e) {
      } finally {
        this.loading = false
      }
    },

    reset () {
      this.draft = resetDraft()
      this.day = null
      this.playdates = []
      this.playdateSelected = null
    }
  }
}
</script>
