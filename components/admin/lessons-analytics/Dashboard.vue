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
import { defineComponent, ref, onBeforeUnmount } from '@nuxtjs/composition-api'

import { useNuxtHelper } from '@/composables'

import GraphicsPanelVideos from '@/components/admin/lessons-analytics/GraphicsPanel.vue'
import GraphicsPanelWorksheets from '@/components/admin/lessons-analytics/worksheets/GraphicsPanel.vue'
import ContentLessonDialog from '@/components/admin/lessons-analytics/ContentLessonDialog.vue'

import { Video } from '@/models'

export default defineComponent({
  name: 'Dashboard',

  components: {
    GraphicsPanelVideos,
    GraphicsPanelWorksheets,
    ContentLessonDialog
  },

  setup () {
    const nuxt = useNuxtHelper()

    const analitycsVideo = ref(true)
    const idWorksheet = ref<number | null>(null)
    const video = ref<Video | null>(null)

    nuxt.$on('send-video', (newVideo: Video | null) => {
      analitycsVideo.value = true
      video.value = newVideo
    })

    onBeforeUnmount(() => {
      nuxt.$off('send-video')
    })

    // this references `ref="contentLessonRef"` when the component is mounted
    const contentLessonRef = ref<any>(null)

    const openDialog = (lesson: unknown) => {
      contentLessonRef.value.open(null, lesson)
    }

    const closeDialog = () => {
      contentLessonRef.value.close()
    }

    const analyticsWorksheets = (worksheetId: number) => {
      idWorksheet.value = worksheetId
      analitycsVideo.value = false
      closeDialog()
    }

    return {
      analitycsVideo,
      idWorksheet,
      video,
      openDialog,
      closeDialog,
      analyticsWorksheets
    }
  }
})
</script>
