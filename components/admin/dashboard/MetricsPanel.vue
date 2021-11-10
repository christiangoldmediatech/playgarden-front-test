<template>
  <v-row>
    <v-col cols="3">
      <v-card>
        <v-card-text>
          <label class="title-dashboard font-weight-bold">Average</label>
          <v-row class="mt-n4" align="center">
            <v-col cols="12">
              <p class="text-center cursor mt-4">
                <span>video lessons <br> per day</span>
              </p>
              <div @click="usersFilters('Active')">
                <div class="text-center">
                  <label class="display-3 font-weight-bold total-users cursor">{{ dataMetrics.averageLessonsVideoPerDay }}</label>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="3">
      <v-card>
        <v-card-text>
          <label class="title-dashboard font-weight-bold">Average</label>
          <v-row class="mt-n4" align="center">
            <v-col cols="12">
              <p class="text-center cursor mt-4">
                <span>videos started <br> per day</span>
              </p>
              <div @click="usersFilters('Active')">
                <div class="text-center">
                  <label class="display-3 font-weight-bold total-users cursor">{{ dataMetrics.averageStartedVideoPerDay }}</label>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="3">
      <v-card>
        <v-card-text>
          <label class="title-dashboard font-weight-bold">Average</label>
          <v-row class="mt-n4" align="center">
            <v-col cols="12">
              <p class="text-center cursor mt-4">
                <span>minutes to complete <br>the lessons</span>
              </p>
              <div @click="usersFilters('Active')">
                <div class="text-center">
                  <label class="display-3 font-weight-bold total-users cursor">{{ dataMetrics.averageStartedVideoPerDay }}</label>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="3">
      <v-card>
        <v-card-text>
          <label class="title-dashboard font-weight-bold">Total</label>
          <v-row class="mt-n4" align="center">
            <v-col cols="12">
              <p class="text-center cursor mt-4">
                <span>lessons <br>completed</span>
              </p>
              <div @click="usersFilters('Active')">
                <div class="text-center">
                  <label class="display-3 font-weight-bold total-users cursor">{{ dataMetrics.numberCompletedLessons }}</label>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="3">
      <v-card>
        <v-card-text>
          <label class="title-dashboard font-weight-bold">Average</label>
          <v-row class="mt-n4" align="center">
            <v-col cols="12">
              <p class="text-center cursor mt-4">
                <span>attendees to Live <br>classes per day </span>
              </p>
              <div @click="usersFilters('Active')">
                <div class="text-center">
                  <label class="display-3 font-weight-bold total-users cursor">{{ dataMetrics.averageAsistantsLiveClassesPerDay }}</label>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from '@vue/composition-api'
import { useMetrics } from '@/composables/dashboard'
import { Metrics } from '@/models'

export default defineComponent({
  name: 'MetricsPanel',
  setup() {
    const { metrics, getMetrics } = useMetrics()
    const dataMetrics = ref<Partial<Metrics>>({
      averageLessonsVideoPerDay: 0,
      averageStartedVideoPerDay: 0,
      avgTimeToComplete: 0,
      numberCompletedLessons: 0,
      averageAsistantsLiveClassesPerDay: 0,
      averageTimeByCurriculumType: {}
    })
    onMounted(async () => {
      await getMetrics()
      if (metrics.value) {
        dataMetrics.value = metrics.value
      }
    })

    return {
      dataMetrics
    }
  }
})
</script>
