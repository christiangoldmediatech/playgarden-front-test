<template>
  <v-main>
    <v-container :class="{ 'dashboard-container': !$vuetify.breakpoint.smAndDown }" fluid>
      <v-row class="fill-height" justify="center">
        <v-col
          class="dashboard-column order-last order-md-first"
          cols="12"
          sm="8"
          md="5"
          lg="4"
          xl="3"
        >
          <dashboard-panel v-bind="{ lesson }" />
        </v-col>
        <v-col
          class="dashboard-column d-flex flex-column"
          cols="12"
          sm="12"
          md="7"
          lg="8"
          xl="9"
        >
          <!-- Tutorial row -->
          <v-row
            class="dashboard-tip-row flex-grow-0 flex-shrink-1"
            justify="center"
            justify-md="start"
            align="center"
            :no-gutters="$vuetify.breakpoint.smAndUp"
          >
            <div class="dashboard-child-pick-container">
              <child-select
                :value="value"
                hide-details
                :preview-mode="previewMode"
                @input="$emit('input', $event)"
              />
            </div>

            <v-col class="text-center text-sm-right">
              <span class="font-weight-medium">
                First time using Playgarden?
              </span>

              <v-btn color="primary" text v-bind="!previewMode ? { nuxt: true, to: { name: 'app-onboarding' } } : {}">
                WATCH TUTORIAL HERE
              </v-btn>
            </v-col>
          </v-row>

          <v-row :class="['dashboard-content', { 'dashboard-mobile-content': $vuetify.breakpoint.sm, 'dashboard-xs-content': $vuetify.breakpoint.xs }]" no-gutters>
            <v-col class="dashboard-content-column" cols="12">
              <pg-loading v-if="$route.name === 'app-dashboard' || loading" />
              <slot />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
    <lesson-activity-player />
  </v-main>
</template>

<script>
import ChildSelect from '@/components/app/ChildSelect.vue'
import DashboardPanel from '@/components/app/dashboard/DashboardPanel.vue'
import LessonActivityPlayer from '@/components/app/dashboard/LessonActivityPlayer.vue'

export default {
  name: 'DashboardLayout',

  components: {
    ChildSelect,
    DashboardPanel,
    LessonActivityPlayer
  },

  props: {
    value: {
      validator: (val) => {
        return typeof val === 'number' || val === null
      },
      default: null
    },

    lesson: {
      validator: (val) => {
        return typeof val === 'object' || val === null
      },
      default: null
    },

    loading: {
      type: Boolean,
      required: false,
      default: false
    },

    previewMode: {
      type: Boolean,
      required: false,
      default: false
    }
  }
}
</script>

<style lang="scss">
.dashboard {
  &-container {
    height: calc(100vh - 64px);
    max-height: calc(100vh - 64px);
  }
  &-column {
    height: 100%;
    max-height: 100%;
  }
  &-child-pick-container {
    width: 225px;
  }
  &-content {
    height: calc(100% - 70px);
    &-column {
      max-height: 100%;
    }
    &-card {
      box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16) !important;
    }
  }
  &-tip-row {
    min-height: 70px;
  }
  &-mobile-content {
    min-height: calc(100vh - 162px);
  }
  &-xs-content {
    min-height: calc(100vh - 256px);
  }
  &-video-thumbnail {
    background-image: var(--videoThumbnailUrl);
    background-position: center, center;
    background-repeat: no-repeat, no-repeat;
    background-size: cover;
  }
}
</style>
