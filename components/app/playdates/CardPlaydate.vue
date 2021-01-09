<template>
  <v-card class="mx-auto" max-width="500" elevation="2" tile>
    <v-row>
      <v-col md="5" sm="12" class="align-self-center">
        <v-row justify="center" no-gutters>
          <v-col cols="8">
            <v-avatar size="120">
              <v-img
                max-width="120"
                alt="Educational Playdates"
                :src="require('assets/png/playdates/playdate.png')"
                class="align-self-center"
              />
            </v-avatar>
          </v-col>

          <v-col cols="12">
            <h6 class="text-center">
              Today: {{ playdate.day }}
            </h6>
          </v-col>
        </v-row>
      </v-col>

      <v-col md="7" sm="12" class="ml-n5">
        <v-list-item three-line>
          <v-list-item-content>
            <div class="headline mb-2">
              Playdate {{ playdate.firstName || "Child" }}’s
            </div>

            <v-list-item-title class="overline mb-1">
              With {{ specialist.fullName }}
            </v-list-item-title>

            <v-list-item-subtitle class="mt-3 font-weight-bold">
              JOIN YOUR FRIENDS!
            </v-list-item-subtitle>

            <v-list-item-subtitle class="mt-3">
              Ages recommended:
            </v-list-item-subtitle>

            <v-list-item-subtitle class="mt-3">
              Duration:
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <!-- CardPlaydatePopup -->
        <v-dialog
          v-model="dialog"
          content-class="elevation-0"
          width="100%"
          persistent
        >
          <v-row no-gutters justify="start">
            <v-btn
              class="top-left text-none"
              color="#f89838"
              text
              @click="dialog = false"
            >
              <v-icon class="mr-2" small left color="#f89838">
                mdi-less-than
              </v-icon>
              Back
            </v-btn>
          </v-row>

          <template v-slot:activator="{ on, attrs }">
            <v-btn class="white--text" color="#f89838" v-bind="attrs" v-on="on">
              Join Playdate
            </v-btn>
          </template>

          <v-card
            class="mx-auto mt-16"
            max-width="700"
            max-height="700"
            elevation="2"
            tile
          >
            <div class="green-line green-line-1" />
            <div class="green-line green-line-2" />
            <v-row>
              <v-col md="5" sm="12" class="align-self-center">
                <v-row justify="center" no-gutters>
                  <v-col align-self="center">
                    <v-row justify="center">
                      <v-avatar size="120">
                        <v-img
                          max-width="120"
                          alt="Educational Playdates"
                          :src="require('assets/png/playdates/playdate.png')"
                          class="align-self-center"
                        />
                      </v-avatar>
                    </v-row>
                    <h6 class="text-center">
                      Today: {{ playdate.day }}
                    </h6>
                  </v-col>
                </v-row>
              </v-col>

              <v-col md="7" sm="12" class="ml-n5">
                <v-list-item three-line>
                  <v-list-item-content>
                    <div class="headline mb-2">
                      Playdate {{ playdate.firstName || "Child" }}
                    </div>

                    <v-list-item-title class="overline mb-1">
                      With {{ specialist.fullName }}
                    </v-list-item-title>

                    <v-list-item-subtitle class="mt-3 font-weight-bold">
                      JOIN YOUR FRIENDS!
                    </v-list-item-subtitle>

                    <v-list-item-subtitle class="mt-3">
                      Ages recommended: {{ playdate.ages }}
                    </v-list-item-subtitle>

                    <v-list-item-subtitle class="mt-3">
                      Duration:
                    </v-list-item-subtitle>

                    <v-list-item-subtitle class="mt-5">
                      <h5>who's going?</h5>

                      <child-select
                        :value="playdate.childrenId"
                        hide-details
                        readonly
                      />
                    </v-list-item-subtitle>

                    <v-list-item-subtitle />
                  </v-list-item-content>
                </v-list-item>
              </v-col>
            </v-row>

            <v-row justify="center" no-gutters>
              <v-col cols="8" class="mb-5">
                <v-btn class="white--text" color="#f89838" block x-large>
                  Join Playdate
                </v-btn>

                <pg-ics-calendar :entry="entry" />
              </v-col>
            </v-row>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import { get } from 'lodash'

import ChildSelect from '@/components/app/ChildSelect.vue'

export default {
  name: 'CardPlaydate',

  components: {
    ChildSelect
  },

  props: {
    playdate: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    dialog: false,

    today: new Date().getUTCDay(),

    week: [
      { MONDAY: 1 },
      { TUESDAY: 2 },
      { WEDNESDAY: 3 },
      { THURSDAY: 4 },
      { FRIDAY: 5 }
    ]
  }),

  computed: {
    backpackImages () {
      return get(this.playdate, 'backpackChildrenImages.0', []).map(
        ({ image }) => image
      )
    },

    isToday () {
      return this.today === this.playdateInfo.day || 1
    },

    playdateInfo () {
      return get(this.playdate, 'playdates.0.playdate', {})
    },

    specialist () {
      return get(this.playdateInfo, 'specialistUser.user', {})
    },

    entry () {
      return {
        title: this.playdateInfo.name,
        description: this.playdateInfo.description,
        link: this.playdateInfo.name,
        dateStart: this.playdateInfo.start,
        dateEnd: this.playdateInfo.end
      }
    }
  }
}
</script>
