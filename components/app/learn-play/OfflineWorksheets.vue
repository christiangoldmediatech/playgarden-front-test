<template>
  <v-row>
    <main>
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
        <v-row no-gutters class="py-2">
          <v-col cols="9" align-self="center" class="pl-2">
            <div class="text-uppercase dashboard-item-title">
              {{ offlineWorksheet.name }}
            </div>
          </v-col>
          <v-col
            cols="3"
            align-self="center"
            class="d-flex justify-center"
          >
            <v-img
              height="40px"
              contain
              :src="
                require('@/assets/png/dashboard/download-worksheet.png')
              "
            />
          </v-col>
        </v-row>
      </v-card>
    </main>
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
      loading: false
    }
  }
}
</script>
