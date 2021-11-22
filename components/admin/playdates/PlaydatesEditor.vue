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
                        <span class="subheader">Title:</span>
                      </v-col>

                      <v-col>
                        <validation-provider
                          v-slot="{ errors }"
                          name="title"
                          rules="required"
                        >
                          <pg-text-field
                            v-model="playdate.title"
                            :error-messages="errors"
                            placeholder="Title of the playdate"
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
                        <span class="subheader">Activity:</span>
                      </v-col>
                      <v-col>
                        <validation-provider
                          v-slot="{ errors }"
                          name="Activity"
                          rules="required"
                        >
                          <pg-select
                            v-model="playdate.activityTypeId"
                            clearable
                            :error-messages="errors"
                            :items="activityTypesList"
                            item-text="name"
                            item-value="id"
                            label="Activity"
                            solo-labeled
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
                        <span class="subheader">Letter:</span>
                      </v-col>
                      <v-col>
                        <validation-provider v-slot="{ errors }" name="Letter">
                          <pg-select
                            v-model="playdate.curriculumTypeId"
                            clearable
                            :error-messages="errors"
                            :items="curriculumTypes"
                            item-text="name"
                            item-value="id"
                            label="Letter"
                            solo-labeled
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
                          rules="required|url"
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
import dayjs from 'dayjs'
import { defineComponent, onMounted, ref, useRouter, computed, useRoute } from '@nuxtjs/composition-api'
import { useSnotifyHelper } from '@/composables'
import { usePlaydates } from '@/composables/playdates'
import { formatDate, stringsToDate } from '@/utils/dateTools'
import { ActivityType, CurriculumType, Meeting } from '@/models'

export default defineComponent({
  name: 'PlaydatesEditor',

  setup () {
    const route = useRoute()
    const router = useRouter()
    const snotify = useSnotifyHelper()
    const loading = ref(true)
    const menuStart = ref(false)
    const menuEnd = ref(false)
    const id = ref<null|number>()
    const timeStart = ref<null|string>()
    const timeEnd = ref<null|string>()
    const curriculumTypes = ref<CurriculumType[]>([])
    const activityTypes = ref<ActivityType[]>([])
    const ages = ['1', '2', '3', '4']
    const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']
    const playdate = ref<Partial<Meeting>>({
      title: '',
      description: '',
      duration: 0,
      day: '',
      ages: '',
      dateStart: null,
      dateEnd: null,
      spots: 0,
      activityTypeId: null,
      curriculumTypeId: null,
      link: '',
      type: 'Playdate'
    })

    const { createPlaydate, updatePlaydate, getPlaydatesById, getActivityTypes, getCurriculumTypes } = usePlaydates()

    const activityTypesList = computed(() => {
      return activityTypes.value.map(item => ({ name: item.name, id: item.id }))
    })

    const toLocalTime = (time: string) => {
      return formatDate(time, {
        format: 'HH:mm:ss',
        fromFormat: 'HH:mm:ss',
        fromUtc: true,
        returnObject: false
      })
    }

    const title = computed(() => {
      return id.value ? 'Edit Play date' : 'New Play date'
    })

    const backUrl = () => {
      router.go(-1)
    }

    const save = async () => {
      loading.value = true
      try {
        /* playdate.value.dateStart = formatDate(timeStart.value, {
          format: 'HH:mm:ss',
          fromFormat: 'HH:mm',
          toUtc: true,
          returnObject: false
        })

        playdate.value.end = formatDate(timeEnd.value, {
          format: 'HH:mm:ss',
          fromFormat: 'HH:mm',
          toUtc: true,
          returnObject: false
        }).toString() */

        console.log('playdate --', playdate.value)

        if (timeStart.value) {
          const start = stringsToDate(dayjs().format('YYYY-MM-DD').toString(), timeStart.value)
          playdate.value.dateStart = start
        }

        if (timeEnd.value) {
          const end = stringsToDate(dayjs().format('YYYY-MM-DD').toString(), timeEnd.value)
          playdate.value.dateEnd = end
        }

        console.log('playdate --', playdate.value)

        if (id.value) {
          await updatePlaydate(id.value, playdate.value)
          snotify.success('Playdate saved successfully.')
        } else {
          await createPlaydate(playdate.value)
          snotify.success('Playdate updated successfully.')
        }
        backUrl()
      } catch (err) {
        loading.value = false
      }
    }

    onMounted(async () => {
      if (route.value.query.id) {
        id.value = Number(route.value.query.id)
      }

      if (id.value) {
        const data = await getPlaydatesById(id.value)
        playdate.value = data

        if (data.activityType) {
          playdate.value.activityTypeId = data.activityType.id
        }

        if (data.curriculumType) {
          playdate.value.curriculumTypeId = data.curriculumType.id
        }
      }

      curriculumTypes.value = await getCurriculumTypes()
      activityTypes.value = await getActivityTypes()
    })

    return {
      id,
      loading,
      menuStart,
      menuEnd,
      timeStart,
      timeEnd,
      ages,
      days,
      playdate,
      title,
      curriculumTypes,
      activityTypesList,
      save
    }
  },

  methods: {

    getUrlBack () {
      this.$router.go(-1)
    }
  }
})
</script>
