<template>
  <v-main>
    <v-container fluid>
      <v-row>
        <v-col cols="12" sm="5" md="4" lg="3">
          <dashboard-panel />
        </v-col>

        <v-col cols="12" sm="7" md="8" lg="9">
          <v-row align="center" class="px-3">
            <v-btn color="primary" :to="{ name: 'app-pick-child' }">
              PICK CHILD
            </v-btn>

            <v-spacer />

            <span class="titleOnDashboard">First time using Playgarden?</span>

            <v-btn color="primary" nuxt text :to="{ name: 'app-onboarding' }">
              WATCH TUTORIAL HERE
            </v-btn>
          </v-row>

          <v-row>
            <v-col class="pt-5">
              <v-row
                v-if="$route.name === 'app-dashboard'"
                align="center"
                fill-height
                justify="center"
              >
                <v-col class="text-center" cols="4">
                  <div>
                    <img class="logo-img" src="@//assets/svg/logo.svg">
                  </div>

                  <v-progress-linear color="primary" indeterminate :size="20" />
                </v-col>
              </v-row>

              <nuxt-child />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import DashboardPanel from '@/components/app/dashboard/DashboardPanel'

export default {
  name: 'Dashboard',

  components: {
    DashboardPanel
  }
}
</script>

<style lang="scss" scoped>
.titleOnDashboard {
  font-weight: 500 !important;
  color: $pg-black !important;
}
</style>
