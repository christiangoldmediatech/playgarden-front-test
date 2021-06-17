<template>
  <v-container
    :class="{ 'dashboard-container': !$vuetify.breakpoint.smAndDown }"
    fluid
  >
    <v-row>
      <v-col cols="12">
        <content-lesson-dialog
          ref="contentLessonRef"
          @worksheets="analyticsWorksheets"
        />
      </v-col>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-title>
            Lessons Analytics
            <v-spacer />
            <v-btn
              class="text-none"
              color="accent darken-1"
              depressed
              nuxt
              small
              :to="{
                name: 'admin-curriculum-management'
              }"
            >
              Back
            </v-btn>
          </v-card-title>
        </v-card>
      </v-col>
      <v-col cols="12">
        <graphics-panel-videos v-if="analitycsVideo" ref="graphicsPanelVideosRef" :current-video="video" @open="openDialog" @close="closeDialog" />
        <graphics-panel-worksheets v-else ref="graphicsPanelWorksheetsRef" :worksheet-id="idWorksheet" @open="openDialog" @close="closeDialog" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import GraphicsPanelVideos from '@/components/admin/lessons-analytics/GraphicsPanel.vue'
import GraphicsPanelWorksheets from '@/components/admin/lessons-analytics/worksheets/GraphicsPanel.vue'
import ContentLessonDialog from '@/components/admin/lessons-analytics/ContentLessonDialog.vue'

export default defineComponent({
  name: 'Dashboard',

  data () {
    return {
      analitycsVideo: true,
      idWorksheet: null,
      video: null
    }
  },

  components: {
    GraphicsPanelVideos,
    GraphicsPanelWorksheets,
    ContentLessonDialog
  },

  created () {
    this.$nuxt.$on('send-video', (video) => {
      this.analitycsVideo = true
      this.video = video
    })
  },

  beforeDestroy () {
    this.$nuxt.$off('send-video')
  },

  methods: {
    openDialog (lesson) {
      this.$refs.contentLessonRef.open(null, lesson)
    },

    closeDialog () {
      this.$refs.contentLessonRef.close()
    },

    loadInfoVideo () {},

    analyticsWorksheets (idWorksheet) {
      this.idWorksheet = idWorksheet
      this.analitycsVideo = false
      this.closeDialog()
    }
  }
})
</script>
