<template>
  <v-card>
    <dashboard-message
      :loading="false"
      :time-out="false"
      :background-image="require('@/assets/jpg/worksheets_completed_1.jpg')"
      :buttons="buttons"
      :return-text="false"
    >
      <template v-slot:title>
        <span class="title-text white--text text-h3 font-weight-medium">
          Hands-on Learning
        </span>
      </template>
      <p>
        Hands-on learning is a crucial part of the educational experience. Learning through doing strengthens the cognitive connections and builds a strong foundation for knowledge.
      </p>
    </dashboard-message>
    <upload-offline-worksheet v-model="dialog" v-bind="{ url }" />
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import DashboardMessage from '@/components/app/dashboard/DashboardMessage.vue'
import UploadOfflineWorksheet from '@/components/app/dashboard/worksheets/UploadOfflineWorksheet.vue'

export default {
  name: 'OfflineWorksheet',

  components: {
    DashboardMessage,
    UploadOfflineWorksheet
  },

  data: () => {
    return {
      dialog: false,
      loading: false
    }
  },

  computed: {
    ...mapGetters('admin/curriculum', ['getLesson']),

    sheets () {
      if (this.getLesson) {
        return this.getLesson.worksheets.filter(({ type }) => type === 'OFFLINE')
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
              window.open(this.url, '_blank')
            }
          }
        },
        {
          text: 'UPLOAD HANDS-ON WORKSHEET',
          color: '#FEC572',
          iconLeft: 'mdi-paperclip',
          action: () => {
            this.dialog = true
          }
        }
      ]
    }
  }
}
</script>
