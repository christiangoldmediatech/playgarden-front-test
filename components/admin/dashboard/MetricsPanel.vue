<template>
  <v-row>
    <v-col cols="12">
      <v-card class="mx-3">
        <v-card-text>
          <label class="title-dashboard font-weight-bold">Average times per lesson in minutes</label>
          <line-stack-chart :line-stack-data="lineStack" />
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
import { Metrics, lineStack } from '@/models'
import LineStackChart from '@/components/echart/LineStackChart.vue'

export default defineComponent({
  name: 'MetricsPanel',
  components: { LineStackChart },
  setup() {
    const { metrics, getMetrics } = useMetrics()
    const lineStack = ref<Partial<lineStack>>({
      xAxis: [],
      legend: [],
      data: []
    })
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
        lineStack.value.xAxis = metrics.value.averageTimeByCurriculumType.xAxis
        lineStack.value.legend = ['Lesson', 'Activities & Worksheets']
        lineStack.value.data = [
          {
            name: 'Lesson',
            type: 'line',
            stack: 'Lesson',
            data: metrics.value.averageTimeByCurriculumType.averageTimeByLesson
          },
          {
            name: 'Activities & Worksheets',
            type: 'line',
            stack: 'Activities & Worksheets',
            data: metrics.value.averageTimeByCurriculumType.averageTimeByActivitiesWorksheets,
            color: 'orange'
          }
        ]
      }
    })

    return {
      dataMetrics,
      lineStack
    }
  }
})
</script>
