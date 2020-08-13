<template>
  <v-main>
    <v-container fluid>
      <v-row>
        <v-col cols="12" sm="5" md="4" lg="3">
          <dashboard-panel />
        </v-col>

        <v-col cols="12" sm="7" md="8" lg="9">
          <v-row align="center" class="pr-3" justify="end">
            First time using Playgarden?

            <v-btn color="primary" text>
              WATCH TUTORIAL HERE
            </v-btn>
          </v-row>

          <v-row>
            <v-col class="pt-5">
              <nuxt-child />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import DashboardPanel from '@/components/app/dashboard/DashboardPanel'

export default {
  name: 'Dashboard',

  components: {
    DashboardPanel
  },

  computed: {
    ...mapGetters({ currentChild: 'getCurrentChild' }),

    childrenIds () {
      return this.currentChild ? this.currentChild.map(({ id }) => id) : []
    }
  },

  created () {
    try {
      // this.getCurrentLessonByChildrenId({ childrenIds: this.childrenIds })

      this.getLessonById(17).then((data) => {
        if (this.$route.name === 'app-dashboard') {
          const id = data.videos[0].id
          this.$router.push({ name: 'app-dashboard-videos-id', params: { id } })
        }
      })
    } catch (e) {}
  },

  methods: {
    ...mapActions('admin/curriculum', ['getLessonById'])
    // ...mapActions('children/lesson', ['getCurrentLessonByChildrenId'])
  }
}
</script>
