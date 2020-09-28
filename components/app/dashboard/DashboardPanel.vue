<template>
  <div class="dashboard-panel-container">
    <v-card class="dashboard-panel-card" height="100%">
      <div class="dashboard-panel-card-border-top" />
      <div class="lesson-day-row">
        <div class="lesson-day-outer">
          <div class="lesson-day-inner">
            <div class="lesson-day-circle">
              <span class="lesson-day-letter">
                {{ lesson ? lesson.curriculumType.letter : null }}
              </span>

              <span class="lesson-day-number">
                DAY {{ lesson ? lesson.day : null }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="dashboard-panel-content pa-3">
        <content-section
          number="1"
          title="Video Lessons"
          :progress="videos.progress"
          :progress-next="videos.progressNext"
          enabled
        >
          <content-list :items="videos.items" />
        </content-section>

        <content-section
          number="2"
          title="Worksheets"
          :progress="worksheets.progress"
          :progress-next="worksheets.progressNext"
          :enabled="videos.progress === 100"
        >
          <template v-slot:title-append>
            <v-img
              :class="['ml-2', { 'dashboard-panel-disabled': videos.progress < 100 }]"
              :src="require('@/assets/png/dashboard/worksheets.png')"
              max-width="32px"
              max-height="32px"
              contain
            />
          </template>
          <v-list class="py-0" dense>
            <v-list-item
              v-if="worksheets.ONLINE.length"
              class="dashboard-item"
              active-class="dashboard-item-active"
              exact-active-class="dashboard-item-exact"
              :disabled="videos.progress < 100"
              nuxt
              exact
              :to="generateNuxtRoute('online-worksheet')"
            >
              <v-list-item-content>
                <v-list-item-title :class="['dashboard-panel-worksheet-text', { 'dashboard-item-disabled': videos.progress < 100 }]">
                  ONLINE WORKSHEET
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              v-if="worksheets.OFFLINE"
              class="dashboard-item"
              active-class="dashboard-item-active"
              exact-active-class="dashboard-item-exact"
              :disabled="videos.progress < 100"
              nuxt
              exact
              :to="generateNuxtRoute('offline-worksheet')"
            >
              <v-list-item-content>
                <v-list-item-title :class="['dashboard-panel-worksheet-text', { 'dashboard-item-disabled': videos.progress < 100 }]">
                  HANDS-ON LEARNING
                </v-list-item-title>
                <v-btn
                  id="worksheet-btn"
                  class="dashboard-panel-worksheet-btn white--text"
                  color="primary"
                  :disabled="videos.progress < 100"
                  block
                >
                  <v-icon color="white" left>
                    mdi-download
                  </v-icon>
                  DOWNLOAD WORKSHEET
                </v-btn>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </content-section>

        <content-section
          number="3"
          title="Activities"
          :progress="activities.progress"
          :progress-next="activities.progressNext"
          :enabled="videos.progress === 100"
        >
          <content-list :items="activities.items" />
        </content-section>
      </div>
    </v-card>
  </div>
</template>

<script>
import DashboardMixin from '@/mixins/DashboardMixin'
import ContentSection from './ContentSection.vue'
import ContentList from './ContentList.vue'

export default {
  name: 'DashboardPanel',

  components: {
    ContentSection,
    ContentList
  },

  mixins: [DashboardMixin],

  props: {
    lesson: {
      required: false,
      validator: (val) => {
        return val === null || typeof val === 'object'
      },
      default: null
    },

    displayMode: {
      type: Boolean,
      required: false,
      default: false
    },

    customOverrides: {
      type: Object,
      required: false,
      default: () => {}
    }
  }
}
</script>

<style lang="scss">
.dashboard-panel {
  &-container {
    height: 100%;
    padding-top: 70px;
    max-width: 471px;
  }

  &-card {
    padding-top: 87px;
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16) !important;
    &-border-top {
      width: 100%;
      height: 18px;
      position: absolute;
      top: 0;
      background-color: #c2daa5;
      box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.29);
      border-radius: 5px;
    }
  }

  &-content {
    height: 100%;
    max-height: 100%;
    overflow-y: auto;
  }

  &-worksheet {
    &-text {
      font-size: 16px !important;
      font-weight: bold !important;
      letter-spacing: 0.1em !important;
    }
    &-btn {
      height: 36px;
    }
  }

  &-disabled {
    -webkit-filter: opacity(40%); /* Chrome, Safari, Opera */
    filter: opacity(40%);
  }
}

#worksheet-btn.v-btn--disabled, #worksheet-btn.v-btn--disabled i.v-icon {
  color: white !important;
  font-size: 18px !important;
  font-weight: bold !important;
  letter-spacing: 0.04em !important;
}

.lesson-day {
  &-row {
    position: absolute;
    top: -70px;
    justify-content: center;
    width: 100%;
    display: flex;
    margin: 0 auto;
  }

  &-outer {
    width: 158px;
    height: 158px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background-color: #c2daa5;
    box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.18);
  }

  &-inner {
    width: 136px;
    height: 136px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background-color: #dce7b5;
    box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.18);
  }

  &-circle {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: white;
    box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.18);
    border-radius: 50%;
    height: 120px;
    width: 120px;
  }

  &-letter {
    color: var(--v-accent-base);
    font-size: 49px;
    line-height: 49px;
    font-weight: bold;
    text-align: center;
  }

  &-number {
    color: var(--v-accent-base);
    font-size: 24px;
    font-weight: bold;
    line-height: 24px;
    text-align: center;
    margin-bottom: 11px;
  }
}
</style>
