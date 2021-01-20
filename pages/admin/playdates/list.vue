<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-title>
            {{ specialistName || "Specialist" }}’s play date
            <v-spacer />
            <v-btn
              class="text-none"
              color="accent darken-1"
              depressed
              nuxt
              small
              :to="getUrlBack"
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
          <v-card-text>
            <v-col>
              <v-row align-content="center">
                <!-- COL1-->
                <v-col cols="12" md="6">
                  <v-row>
                    <v-col cols="12">
                      <span
                        class="subheader"
                      >Name: <b>{{ playdate.name }}</b></span>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="12">
                      <span
                        class="subheader"
                      >Description: <b>{{ playdate.description }} </b></span>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="12">
                      <span
                        class="subheader"
                      >Ages Recommended: <b>{{ playdate.ages }} </b></span>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="12">
                      <span
                        class="subheader"
                      >Start: <b>{{ playdate.start }} </b></span>
                    </v-col>
                  </v-row>

                  <v-card-actions>
                    <v-spacer />
                    <v-btn
                      class="white--text"
                      color="accent"
                      x-large
                      :href="playdate.link"
                    >
                      Join Play date
                    </v-btn>
                    <v-spacer />
                  </v-card-actions>
                </v-col>
                <!-- END COL1 -->
                <!-- COL2-->
                <v-col cols="12" md="6">
                  <v-row>
                    <v-col cols="12">
                      <span
                        class="subheader"
                      >Day: <b>{{ playdate.day }}</b></span>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="12">
                      <span
                        class="subheader"
                      >Spots: <b>{{ playdate.spots }} </b></span>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="12">
                      <span
                        class="subheader"
                      >Duration:<b> {{ playdate.duration }} </b></span>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="12">
                      <span
                        class="subheader"
                      >End: <b>{{ playdate.end }} </b></span>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-col>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

function generatePlaydateTemplate () {
  return {
    id: null,
    name: '',
    description: '',
    duration: '',
    day: null,
    start: null,
    end: null,
    spots: null,
    link: null,
    specialistId: null,
    specialistName: null
  }
}

export default {
  name: 'List',

  layout: 'admin',

  data: vm => ({
    specialistId: vm.$route.query.specialistId
      ? parseInt(vm.$route.query.specialistId)
      : null,
    loading: true,
    time: null,
    menuStart: false,
    specialistName: null,
    menuEnd: false,
    days: [
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAY',
      'SUNDAY'
    ],
    playdate: generatePlaydateTemplate()
  }),

  computed: {
    ...mapGetters('auth', {
      userInfo: 'getUserInfo'
    }),

    getUrlBack () {
      const url = {
        name: 'admin-playdates'
      }
      if (this.userInfo.role.name === 'SUPER_ADMINISTRATORS') {
        url.query = { specialistId: this.specialistId }
      }
      return url
    },

    id () {
      return this.$route.query.id ? parseInt(this.$route.query.id) : null
    },

    activityTypes () {
      return this.types.map(type => ({
        text: type.name,
        value: type.id
      }))
    }
  },

  async created () {
    this.loading = true
    this.playdate.specialistId =
      this.userInfo.role.name === 'SPECIALISTS'
        ? this.userInfo.specialists.id
        : this.specialistId

    if (this.specialistId) {
      const data = await this.getPlaydatesById(this.specialistId)

      if (data) {
        this.playdate.id = data.id
        this.playdate.name = data.name
        this.playdate.description = data.description
        this.playdate.duration = data.duration
        this.playdate.day = data.day
        this.playdate.start = data.start
        this.playdate.end = data.end
        this.playdate.spots = data.spots
        this.playdate.link = data.link
        this.playdate.specialistId = data.specialistUser.id
        this.specialistId = data.specialistUser.id
        this.specialistName = data.specialistUser.user.firstName
      }
    }
  },

  methods: {
    ...mapActions('agendas-playdate', [
      'createPlaydate',
      'updatePlaydate',
      'getPlaydatesById'
    ]),

    async save () {
      this.loading = true
      let id = this.id

      try {
        const playdate = this.playdate
        if (id === null) {
          const response = await this.createPlaydate(playdate)
          id = response.id
        } else {
          await this.updatePlaydate({ id, data: playdate })
        }
      } catch (err) {
        this.loading = false
      } finally {
        await this.$router.push(this.getUrlBack)
      }
    }
  }
}
</script>
