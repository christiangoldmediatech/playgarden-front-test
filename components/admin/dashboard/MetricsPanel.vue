<template>
  <v-row>
    <v-col cols="12">
      <v-card class="mx-3">
        <v-card-text>
          <label class="title-dashboard font-weight-bold">Average times to complete lessons in days</label>
          <line-stack-chart :line-stack-data="lineStack" />
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="3">
      <v-card>
        <v-card-text>
          <label class="title-dashboard font-weight-bold">Videos Lessons</label>
          <v-row class="mt-n4" align="center">
            <v-col cols="12">
              <p class="text-center cursor mt-4">
                <span>Started per day</span>
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
          <label class="title-dashboard font-weight-bold"><span>Video Lessons</span></label>
          <v-row class="mt-n4" align="center">
            <v-col cols="12">
              <p class="text-center cursor mt-4">
                Completed per day
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
          <label class="title-dashboard font-weight-bold">Days to complete</label>
          <v-row class="mt-n4" align="center">
            <v-col cols="12">
              <p class="text-center cursor mt-4">
                <span>Video lessons</span>
              </p>
              <div @click="usersFilters('Active')">
                <div class="text-center">
                  <label class="display-3 font-weight-bold total-users cursor">{{ dataMetrics.avgTimeToComplete }}</label>
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
          <label class="title-dashboard font-weight-bold">Days to complete</label>
          <v-row class="mt-n4" align="center">
            <v-col cols="12">
              <p class="text-center cursor mt-4">
                <span>All lesson</span>
              </p>
              <div @click="usersFilters('Active')">
                <div class="text-center">
                  <label class="display-3 font-weight-bold total-users cursor">{{ dataMetrics.avgTimeToCompleteAll }}</label>
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
          <label class="title-dashboard font-weight-bold">Lessons</label>
          <v-row class="mt-n4" align="center">
            <v-col cols="12">
              <p class="text-center cursor mt-4">
                <span>completed</span>
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
          <label class="title-dashboard font-weight-bold">Live Class attendees</label>
          <v-row class="mt-n4" align="center">
            <v-col cols="12">
              <p class="text-center cursor mt-4">
                <span>per Week</span>
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
      avgTimeToCompleteAll: 0,
      numberCompletedLessons: 0,
      averageAsistantsLiveClassesPerDay: 0,
      averageTimeByCurriculumType: {}
    })
    onMounted(async () => {
      await getMetrics()
      if (metrics.value) {
        dataMetrics.value = metrics.value
        lineStack.value.xAxis = metrics.value.averageTimeByCurriculumType.xAxis
        lineStack.value.legend = ['Videos', 'Videos, Activities & Worksheets']
        lineStack.value.data = [
          {
            name: 'Videos',
            type: 'line',
            stack: 'Videos',
            data: metrics.value.averageTimeByCurriculumType.averageTimeByLesson
          },
          {
            name: 'Videos, Activities & Worksheets',
            type: 'line',
            stack: 'Videos, Activities & Worksheets',
            data: metrics.value.averageTimeByCurriculumType.averageTimeByActivitiesWorksheets
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
