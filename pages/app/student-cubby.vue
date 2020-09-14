<template>
  <v-main>
    <v-container fluid>
      <v-row justify="center">
        <v-col cols="12" md="4" lg="3">
          <student-cubby-panel />
        </v-col>

        <v-col cols="12" md="">
          <v-row align="center" class="mr-3" justify="end">
            <span class="font-weight-medium">First time using Playgarden?</span>

            <v-btn color="primary" nuxt text :to="{ name: 'app-onboarding' }">
              WATCH TUTORIAL HERE
            </v-btn>
          </v-row>

          <template v-if="studentId">
            <v-container>
              <nuxt-child />
            </v-container>
          </template>

          <template v-else>
            <v-container fill-height>
              <v-row align="center" justify="center">
                <v-col class="text-center">
                  <div>
                    <img class="logo-img" src="@/assets/svg/logo.svg">
                  </div>

                  <span class="primary--text text-h5 font-weight-bold">
                    Select your child
                  </span>
                </v-col>
              </v-row>
            </v-container>
          </template>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import StudentCubbyPanel from '@/components/app/student-cubby/StudentCubbyPanel.vue'

export default {
  name: 'StudentCubby',

  components: {
    StudentCubbyPanel
  },

  computed: {
    studentId () {
      return this.$route.query.id
    }
  },

  watch: {
    studentId () {
      // Redirect to puzzle by default
      if (this.$route.name === 'app-student-cubby') {
        this.$router.push({
          name: 'app-student-cubby-puzzle',
          query: { id: this.studentId }
        })
      }
    }
  }
}
</script>
