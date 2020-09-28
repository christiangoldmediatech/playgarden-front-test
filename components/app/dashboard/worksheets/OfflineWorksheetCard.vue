<template>
  <v-card class="d-flex flex-column dashboard-content-card" height="100%">
    <div
      class="d-flex flex-column justify-end align-center offline-image flex-grow-1 flex-shrink-0"
      :style="{ '--offlineWorksheetThumbnailUrl': `url(${require('@/assets/jpg/worksheets_completed_1.jpg')})` }"
    >
      <underlined-title
        class="white--text text-h3 font-weight-medium"
        text="Hands-on Learning"
      />
      <p class="white--text text-center">
        Hands-on learning is a crucial part of the educational experience. Learning through doing strengthens the cognitive connections and builds a strong foundation for knowledge.
      </p>
    </div>
    <v-container>
      <v-row class="flex-column" align="center">
        <h5 class="text-h5 font-weight-bold">
          What do you want to do next?
        </h5>

        <v-col
          v-for="(button, i) in buttons"
          :key="`complete-message-${_uid}-button-${i}`"
          cols="12"
          sm="10"
          md="8"
          lg="7"
        >
          <v-btn
            :color="button.color"
            class="white--text"
            :loading="loading"
            :disabled="button.disabled"
            block
            @click.stop="button.action"
          >
            <v-icon v-if="button.iconLeft" large left>
              {{ button.iconLeft }}
            </v-icon>
            {{ button.text }}
            <v-icon v-if="button.iconRight" right left>
              {{ button.iconRight }}
            </v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
    <upload-offline-worksheet v-model="dialog" v-bind="{ url }" />
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
// import DashboardMessage from '@/components/app/dashboard/DashboardMessage.vue'
// import UploadOfflineWorksheet from '@/components/app/dashboard/worksheets/UploadOfflineWorksheet.vue'

export default {
  name: 'OfflineWorksheetCard',

  // components: {
  //  DashboardMessage,
  //  UploadOfflineWorksheet
  // },

  data: () => {
    return {
      dialog: false,
      loading: false
    }
  },

  computed: {
    ...mapGetters({ children: 'getCurrentChild' }),
    ...mapGetters('admin/curriculum', ['getLesson']),

    sheets () {
      if (this.getLesson) {
        return this.getLesson.worksheets.filter(
          ({ type }) => type === 'OFFLINE'
        )
      }
      return []
    },

    url () {
      return this.sheets[0] ? this.sheets[0].pdfUrl : ''
    },

    buttons () {
      return [
        {
          text: 'DOWNLOAD HANDS-ON WORKSHEET',
          color: 'accent',
          iconLeft: 'mdi-download',
          action: () => {
            if (this.sheets[0]) {
              const date = new Date().toISOString().substr(0, 19)
              const promises = []

              if (!this.sheets[0].completed) {
                this.children.forEach((child) => {
                  promises.push(
                    this.saveWorksheetProgress({
                      lessonId: this.getLesson.id,
                      childId: child.id,
                      worksheet: {
                        id: this.sheets[0].id,
                        completed: true,
                        date
                      }
                    })
                  )
                })
              }

              Promise.all(promises).then(() => {
                this.$nuxt.$emit('dashboard-panel-update')
              })
              window.open(this.url, '_blank')
            }
          }
        },
        {
          text: 'UPLOAD HANDS-ON WORKSHEET',
          color: '#FEC572',
          iconLeft: 'mdi-paperclip',
          disabled: (this.getLesson && this.getLesson.previewMode),
          action: () => {
            this.dialog = true
          }
        }
      ]
    }
  },

  methods: {
    ...mapActions('children/lesson', ['saveWorksheetProgress'])
  }
}
</script>

<style scoped>
.offline-image {
  background-image: linear-gradient(to top, rgba(39, 39, 39, 0.9), rgba(255, 255, 255, 0) 80%), var(--offlineWorksheetThumbnailUrl);
  position: center, center;
  background-repeat: no-repeat, no-repeat;
  background-size: cover;
}
</style>
