<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-title>
            {{ title }}
            <v-spacer />
            <v-btn
              class="text-none"
              color="accent darken-1"
              depressed
              nuxt
              small
              @click="getUrlBack"
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
          <validation-observer v-slot="{ invalid, passes }">
            <v-card-text>
              <v-form>
                <v-row>
                  <!-- COL1-->
                  <v-col cols="12" sm="9" lg="6">
                    <v-row>
                      <v-col class="text-md-right" cols="12" sm="3">
                        <span class="subheader">Name:</span>
                      </v-col>

                      <v-col>
                        <validation-provider
                          v-slot="{ errors }"
                          name="name"
                          rules="required"
                        >
                          <pg-text-field
                            v-model="playdate.name"
                            :error-messages="errors"
                            placeholder="Name of the playdate"
                            solo
                          />
                        </validation-provider>
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col class="text-md-right" cols="12" sm="3">
                        <span class="subheader">Description:</span>
                      </v-col>

                      <v-col>
                        <validation-provider
                          v-slot="{ errors }"
                          name="description"
                          rules="required"
                        >
                          <pg-textarea
                            v-model="playdate.description"
                            rows="6"
                            :error-messages="errors"
                            placeholder="Description of the playdate"
                            solo
                          />
                        </validation-provider>
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col class="text-md-right" cols="12" sm="3">
                        <span class="subheader">Start:</span>
                      </v-col>

                      <v-col>
                        <v-menu
                          ref="menu"
                          v-model="menuStart"
                          :close-on-content-click="false"
                          :nudge-right="40"
                          :return-value.sync="timeStart"
                          transition="scale-transition"
                          offset-y
                          max-width="290px"
                          min-width="290px"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <validation-provider
                              v-slot="{ errors }"
                              name="Time start"
                              rules="required"
                            >
                              <pg-text-field
                                v-model="timeStart"
                                label="Time start"
                                readonly
                                :error-messages="errors"
                                placeholder="Time playdate starts"
                                v-bind="attrs"
                                solo
                                v-on="on"
                              />
                            </validation-provider>
                          </template>
                          <v-time-picker
                            v-if="menuStart"
                            v-model="timeStart"
                            :max="timeEnd"
                            format="24hr"
                            full-width
                            @click:minute="$refs.menu.save(timeStart)"
                          />
                        </v-menu>
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col class="text-md-right" cols="12" sm="3">
                        <span class="subheader">End:</span>
                      </v-col>

                      <v-col>
                        <v-menu
                          ref="menu2"
                          v-model="menuEnd"
                          :close-on-content-click="false"
                          :nudge-right="40"
                          :return-value.sync="timeEnd"
                          transition="scale-transition"
                          offset-y
                          max-width="290px"
                          min-width="290px"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <validation-provider
                              v-slot="{ errors }"
                              name="Time start"
                              rules="required"
                            >
                              <pg-text-field
                                v-model="timeEnd"
                                label="Time end"
                                readonly
                                :error-messages="errors"
                                placeholder="Time end"
                                v-bind="attrs"
                                solo
                                v-on="on"
                              />
                            </validation-provider>
                          </template>
                          <v-time-picker
                            v-if="menuEnd"
                            v-model="timeEnd"
                            :min="timeStart"
                            format="24hr"
                            full-width
                            @click:minute="$refs.menu2.save(timeEnd)"
                          />
                        </v-menu>
                      </v-col>
                    </v-row>
                  </v-col>
                  <!-- END COL1 -->
                  <!-- COL2-->
                  <v-col cols="12" sm="9" lg="6">
                    <v-row>
                      <v-col class="text-md-right" cols="12" sm="3">
                        <span class="subheader">Day:</span>
                      </v-col>

                      <v-col>
                        <validation-provider
                          v-slot="{ errors }"
                          name="Day"
                          rules="required"
                        >
                          <pg-select
                            v-model="playdate.day"
                            :error-messages="errors"
                            placeholder="Select a Day"
                            :items="days"
                            solo
                          />
                        </validation-provider>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col class="text-md-right" cols="12" sm="3">
                        <span class="subheader">Ages:</span>
                      </v-col>

                      <v-col>
                        <validation-provider
                          v-slot="{ errors }"
                          name="Ages"
                          rules="required"
                        >
                          <pg-text-field
                            v-model="playdate.ages"
                            :error-messages="errors"
                            placeholder="Select ages"
                            solo
                          />
                        </validation-provider>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col class="text-md-right" cols="12" sm="3">
                        <span class="subheader">Spots:</span>
                      </v-col>

                      <v-col>
                        <validation-provider
                          v-slot="{ errors }"
                          name="Spots"
                          rules="required"
                        >
                          <pg-text-field
                            v-model="playdate.spots"
                            :error-messages="errors"
                            placeholder="Number of sports available"
                            solo
                          />
                        </validation-provider>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col class="text-md-right" cols="12" sm="3">
                        <span class="subheader">Duration:</span>
                      </v-col>

                      <v-col>
                        <validation-provider
                          v-slot="{ errors }"
                          name="Duration"
                          rules="required"
                        >
                          <pg-text-field
                            v-model="playdate.duration"
                            :error-messages="errors"
                            placeholder="Duration in minutes of the playdate"
                            solo
                          />
                        </validation-provider>
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col class="text-md-right" cols="12" sm="3">
                        <span class="subheader">Link:</span>
                      </v-col>

                      <v-col>
                        <validation-provider
                          v-slot="{ errors }"
                          name="Link"
                          rules="required"
                        >
                          <pg-text-field
                            v-model="playdate.link"
                            :error-messages="errors"
                            placeholder="Zoom link for the playdate"
                            solo
                          />
                        </validation-provider>
                      </v-col>
                    </v-row>
                  </v-col>
                  <!-- END COL1 -->
                </v-row>
              </v-form>
            </v-card-text>

            <v-card-actions>
              <v-spacer />
              <v-btn
                class="px-5 text-none"
                color="primary"
                :disabled="invalid"
                x-large
                @click.stop="passes(save)"
              >
                Save
              </v-btn>
              <v-spacer />
            </v-card-actions>
          </validation-observer>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, useRouter, computed, useRoute } from '@nuxtjs/composition-api'
import { useSnotifyHelper } from '@/composables'
import dayjs from 'dayjs'
import { mapActions, mapGetters } from 'vuex'
import { formatDate } from '@/utils/dateTools'

function generatePlayDateTemplate () {
  return {
    id: null,
    name: '',
    description: '',
    duration: '',
    day: null,
    ages: null,
    start: null,
    end: null,
    spots: null,
    link: null,
    specialistId: null
  }
}

export default defineComponent({
  name: 'PlaydatesEditor',

  layout: 'admin',

  setup (_, { emit }) {
    const snotify = useSnotifyHelper()
    const loading = ref(true)
    const menuStart = ref(false)
    const menuEnd = ref(false)
    const id = ref<null|number>()
    const timeStart = ref<null|string>()
    const timeEnd = ref<null|string>()

    return {
      id,
      loading,
      menuStart,
      menuEnd,
      timeStart,
      timeEnd
    }
  },

  data: vm => ({
    specialistId: vm.$route.query.specialistId
      ? parseInt(vm.$route.query.specialistId)
      : null,
    time: null,
    ages: ['1', '2', '3', '4'],
    today: dayjs(new Date()).format('YYYY-MM-DD'),
    days: [
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAY',
      'SUNDAY'
    ],
    playdate: generatePlayDateTemplate()
  }),

  computed: {
    ...mapGetters('auth', {
      userInfo: 'getUserInfo'
    }),

    id () {
      return this.$route.query.id ? parseInt(this.$route.query.id) : null
    },

    title () {
      return this.id ? 'Edit Play date' : 'New Play date'
    },

    activityTypes () {
      return this.types.map(type => ({
        text: type.name,
        value: type.id
      }))
    }
  },

  watch: {
    'playdate.start' (val) {
      this.timeStart = this.toLocalTime(val)
    },
    'playdate.end' (val) {
      this.timeEnd = this.toLocalTime(val)
    }
  },

  async created () {
    const promises = []
    this.loading = true
    this.playdate.specialistId =
      this.userInfo.role.name === 'SPECIALISTS'
        ? this.userInfo.specialists.id
        : this.specialistId
    if (this.id) {
      promises.push(this.getPlaydatesById(this.id))
    }

    const results = await Promise.all(promises)
    if (results[0]) {
      const data = results[0]
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
      this.playdate.specialistId = data.specialistUser.id
      this.specialistId = data.specialistUser.id
    }
  },

  methods: {
    ...mapActions('playdate', [
      'createPlaydate',
      'updatePlaydate',
      'getPlaydatesById'
    ]),

    toLocalTime (time) {
      return formatDate(time, {
        format: 'HH:mm:ss',
        fromFormat: 'HH:mm:ss',
        fromUtc: true,
        returnObject: false
      })
    },

    getUrlBack () {
      this.$router.go(-1)
    },

    async save () {
      this.loading = true
      let id = this.id

      try {
        const playdate = this.playdate
        playdate.start = formatDate(this.timeStart, {
          format: 'HH:mm:ss',
          fromFormat: 'HH:mm',
          toUtc: true,
          returnObject: false
        })
        playdate.end = formatDate(this.timeEnd, {
          format: 'HH:mm:ss',
          fromFormat: 'HH:mm',
          toUtc: true,
          returnObject: false
        })

        if (id === null) {
          const response = await this.createPlaydate(playdate)
          id = response.id
        } else {
          await this.updatePlaydate({ id, data: playdate })
        }
        this.getUrlBack()
      } catch (err) {
        this.loading = false
      }
    }
  }
})
</script>
