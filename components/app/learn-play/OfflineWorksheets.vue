<template>
  <v-row>
    <v-card
      v-for="(
        offlineWorksheet, offlineWorksheetIndex
      ) in offlineWorksheetList"
      :key="`offlineworksheet-card-item-${offlineWorksheetIndex}`"
      :enabled="true"
      class="dashboard-item"
      width="100%"
      :ripple="false"
    >
      <v-row no-gutters class="my-2">
        <v-col
          cols="2"
          align-self="center"
          class="justify-center d-flex"
        >
          <v-avatar tile size="42">
            <img src="@/assets/png/cute-pumpkin.png">
          </v-avatar>
        </v-col>
        <v-col cols="8" align-self="center" class="pl-2">
          <div class="text-uppercase dashboard-item-title">
            {{ offlineWorksheet.name }}
          </div>
        </v-col>
        <v-col
          cols="2"
          align-self="center"
          class="justify-center d-flex"
        >
          <v-img
            height="40px"
            contain
            class="cursor"
            :src="
              require('@/assets/png/dashboard/download-worksheet.png')
            "
            @click.stop="handleDownloadWorksheetClick(offlineWorksheet)"
          />
        </v-col>
      </v-row>
    </v-card>
  </v-row>
</template>

<script>
export default {
  name: 'OfflineWorksheets',
  props: {
    offlineWorksheetList: {
      type: Array,
      required: true,
      default: () => ([])
    }
  },
  data: () => {
    return {
      loading: false,
      noLinkMode: false,
      currentOfflineWorksheet: null
    }
  },
  methods: {
    openPdf() {
      if (this.currentOfflineWorksheet) {
        window.open(this.currentOfflineWorksheet.pdfUrl, '_blank')
      }
    },
    handleDownloadWorksheetClick(item) {
      this.currentOfflineWorksheet = item
      if (!this.noLinkMode) {
        this.openPdf()
      }
    }
  }
}
</script>

<style scoped>
.cursor {
  cursor: pointer !important;
}
</style>
