<template>
  <validation-observer ref="obs">
    <v-dialog
      v-model="dialog"
      max-width="100%"
      persistent
      scrollable
    >
      <v-card>
        <v-toolbar class="flex-grow-0 toolbar" color="primary darken-1" dark dense flat>
          <v-toolbar-title class="white--text">
            <pg-circle-letter-day
              v-if="item"
              class="mt-5 ml-4"
              :size="64"
              no-auto-position
              :day="item ? item.day : null"
              :letter="item ? item.curriculumType.letter : null"
              @click.native="openContenLesson"
            />
          </v-toolbar-title>

          <v-spacer />

          <v-btn :disabled="loading" icon @click.stop="close">
            <v-icon>
              mdi-close
            </v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text>
          <v-container v-if="item">
            <v-row>
              <v-col cols="4">
                <div class="dashboard-panel-content pa-3">
                  <content-section
                    number="1"
                    title="Video Lessons"
                    :progress="item.videos.progress"
                    :progress-next="item.videos.progressNext"
                    enabled
                  >
                    <content-list :items="item.videos" v-bind="{ noLinkMode }" />
                  </content-section>
                </div>
              </v-col>
              <v-col cols="4">
                <!-- start worsheets -->
                <div class="dashboard-panel-content mt-n3">
                  <content-section
                    v-if="item"
                    number="2"
                    title="Worksheets"
                    :progress="item.worksheets.progress"
                    :progress-next="item.worksheets.progressNext"
                    :enabled="item.videos.progress === 100"
                  >
                    <template v-slot:title-append>
                      <v-img
                        :class="['ml-2', { 'dashboard-panel-disabled': item.videos.progress < 100 }]"
                        :src="require('@/assets/png/dashboard/worksheets.png')"
                        max-width="32px"
                        max-height="32px"
                        contain
                      />
                    </template>
                    <v-list class="py-0" dense>
                      <v-list-item
                        v-if="item.worksheets"
                        class="dashboard-item"
                        active-class="dashboard-item-active"
                        exact-active-class="dashboard-item-exact"
                        :disabled="item.videos.progress < 100"
                        :nuxt="!noLinkMode"
                        :exact="!noLinkMode"
                      >
                        <v-list-item-content>
                          <v-list-item-title :class="['dashboard-panel-worksheet-text', { 'dashboard-item-disabled': item.videos.progress < 100 }]">
                            ONLINE WORKSHEET
                          </v-list-item-title>
                          <v-list-item-subtitle>
                            <v-list class="py-0" dense>
                              <v-list-item
                                v-for="itemOnline in getOnlineWorksheets"
                                :key="`list-${_uid}-item-${itemOnline.id}`"
                                class="dashboard-item"
                                active-class="dashboard-item-active"
                                exact-active-class="dashboard-item-exact"
                              >
                                <v-list-item-content class="select-cursor" @click="goToAnalytics(itemOnline)">
                                  <v-list-item-subtitle :class="{ 'dashboard-item-disabled': itemOnline.disabled }">
                                    <span :class="{ 'dashboard-item-disabled': item.disabled }">{{ itemOnline.name }}</span>
                                  </v-list-item-subtitle>
                                </v-list-item-content>
                              </v-list-item>
                            </v-list>
                          </v-list-item-subtitle>
                          <v-list-item-title :class="['dashboard-panel-worksheet-text', { 'dashboard-item-disabled': item.videos.progress < 100 }]">
                            HANDS-ON LEARNING
                          </v-list-item-title>
                          <v-list-item-subtitle>
                            <v-list class="py-0" dense>
                              <v-list-item
                                v-for="itemOnline in getOfflineWorksheet"
                                :key="`list-${_uid}-item-${itemOnline.id}`"
                                class="dashboard-item"
                                active-class="dashboard-item-active"
                                exact-active-class="dashboard-item-exact"
                              >
                                <v-list-item-content>
                                  <v-list-item-subtitle :class="{ 'dashboard-item-disabled': itemOnline.disabled }">
                                    <span :class="{ 'dashboard-item-disabled': item.disabled }">{{ itemOnline.name }}</span>
                                  </v-list-item-subtitle>
                                </v-list-item-content>
                              </v-list-item>
                            </v-list>
                          </v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </content-section>
                </div>
                <!-- end worsheets -->
              </v-col>
              <v-col cols="4">
                <!-- start activities -->
                <div class="dashboard-panel-content mt-n3">
                  <content-section
                    number="3"
                    title="Activities"
                    :progress="item.videos.progress"
                    :enabled="item.videos.progress === 100"
                  >
                    <content-list :items="getActivities" v-bind="{ noLinkMode }" />
                  </content-section>
                </div>
                <!-- end activities -->
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </validation-observer>
</template>

<script>
import ContentSection from '@/components/app/dashboard/ContentSection.vue'
import ContentList from '@/components/app/dashboard/ContentList.vue'
export default {
  name: 'ContentLessonDialog',

  components: {
    ContentSection,
    ContentList
  },

  data: () => ({
    dialog: false,
    loading: false,
    noLinkMode: false,
    item: null
  }),

  computed: {
    getOfflineWorksheet () {
      if (this.item) {
        return this.item.worksheets.filter(({ type }) => type === 'OFFLINE')
      }
      return []
    },

    getOnlineWorksheets () {
      if (this.item) {
        return this.item.worksheets.filter(({ type }) => type === 'ONLINE')
      }
      return []
    },

    getActivities () {
      if (this.item) {
        return this.item.lessonsActivities.map(item => item.activity)
      }
      return []
    }
  },

  methods: {
    goToAnalytics (item) {
      this.$router.push({
        name: 'admin-worksheets-analytics',
        query: { worksheetId: item.id }
      })
      console.log('item--', item)
    },
    open (evt, item = null) {
      this.item = item
      this.$nextTick(() => {
        this.dialog = true
      })
    },
    close () {
      this.$nextTick(() => {
        this.dialog = false
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>
.toolbar {
  min-height: 70px !important;
}
.select-cursor {
  cursor: pointer !important;
}
</style>
