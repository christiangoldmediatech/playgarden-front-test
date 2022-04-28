<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-title>
            New Kids corner videos

            <v-spacer />

            <v-btn
              class="mr-2 text-none"
              color="accent darken-1"
              dark
              :icon="$vuetify.breakpoint.xs"
              @click="backList"
            >
              <span class="hidden-xs-only white--text">
                Back
              </span>
            </v-btn>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <v-card width="100%">
      <v-card-text>
        <v-row no-gutters class="mt-5">
          <v-col cols="12">
            <v-row>
              <v-col class="text-md-right" cols="12" sm="3">
                <span class="subheader font-weight-bold">Name:</span>
              </v-col>

              <v-col cols="12" sm="9" lg="6">
                <validation-provider
                  v-slot="{ errors }"
                  name="Name"
                  rules="required"
                >
                  <pg-text-field
                    v-model="kidsCornerVideo.name"
                    :error-messages="errors"
                    label="Name"
                    solo-labeled
                  />
                </validation-provider>
              </v-col>
            </v-row>

            <v-row>
              <v-col class="text-md-right" cols="12" sm="3">
                <span class="subheader font-weight-bold">Description:</span>
              </v-col>

              <v-col cols="12" sm="9" lg="6">
                <validation-provider
                  v-slot="{ errors }"
                  name="Description"
                  rules="required"
                >
                  <pg-textarea
                    v-model="kidsCornerVideo.description"
                    :error-messages="errors"
                    label="Description"
                    solo-labeled
                  />
                </validation-provider>
              </v-col>
            </v-row>

            <v-row>
              <v-col class="text-md-right" cols="12" sm="3">
                <span class="subheader font-weight-bold">Category:</span>
              </v-col>

              <v-col cols="12" sm="9" lg="6">
                <validation-provider
                  v-slot="{ errors }"
                  name="Category"
                  rules="required"
                >
                  <pg-select
                    v-model="kidsCornerVideo.activityTypeId"
                    :error-messages="errors"
                    :items="activityTypes"
                    label="Select a category"
                    solo-labeled
                  />
                </validation-provider>
              </v-col>
            </v-row>

            <v-row>
              <v-col class="text-md-right" cols="12" sm="3">
                <span class="subheader font-weight-bold">Curriculum:</span>
              </v-col>

              <v-col cols="12" sm="9" lg="6">
                <pg-select
                  v-model="kidsCornerVideo.curriculumTypeId"
                  :items="listCurriculumTypes"
                  label="Curriculum"
                  solo-labeled
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col class="text-md-right" cols="12" sm="3">
                <span class="subheader font-weight-bold">Report card type:</span>
              </v-col>

              <v-col cols="12" sm="9" lg="6">
                <pg-select
                  v-model="selectedReportCard"
                  :items="listRecordTypes"
                  label="Report card type"
                  solo-labeled
                  multiple
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col class="text-md-right" cols="12" sm="3">
                <span class="subheader font-weight-bold">Topics:</span>
              </v-col>

              <v-col cols="12" sm="9" lg="6">
                <validation-provider
                  v-slot="{ errors }"
                  name="Topics"
                  rules="required"
                >
                  <pg-autocomplete
                    v-model="kidsCornerVideo.topics"
                    addable
                    chips
                    :items="topicsList"
                    clearable
                    label="Topics"
                    :error-messages="errors"
                    :disabled="loading"
                    :menu-props="feature"
                    deletable-chips
                    hide-no-data
                    :loading="loading"
                    multiple
                    solo
                  />
                </validation-provider>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="text-md-right" cols="12" sm="3">
                <span class="subheader font-weight-bold">Thumbnail:</span>
              </v-col>

              <v-col cols="12" sm="9" lg="6">
                <v-img
                  v-if="kidsCornerVideo.thumbnail"
                  class="mb-6"
                  max-height="280"
                  :src="kidsCornerVideo.thumbnail"
                />

                <validation-provider
                  v-slot="{ errors }"
                  name="Thumbnail"
                >
                  <pg-file-uploader
                    ref="thumbnailFileUploaderRef"
                    v-model="thumbnail"
                    append-icon="mdi-camera"
                    :error-messages="errors"
                    label="Upload Thumbnail"
                    mode="image"
                    path="kids-corner-videos-thumbnail"
                    placeholder="Select a thumbnail for this activity video"
                    solo-labeled
                    api="dropbox"
                    jpg
                    png
                    svg
                  />
                </validation-provider>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="text-md-right" cols="12" sm="3">
                <span class="subheader font-weight-bold">Video:</span>
              </v-col>

              <v-col cols="12" sm="9" lg="6">
                <div v-if="video && video.videoUrl" class="video-player-16-9-container">
                  <pg-video-player
                    inline
                    :control-config="{ favorite: false }"
                    @ready="onPlayerReady"
                  />
                </div>

                <v-progress-circular
                  v-else-if="
                    video &&
                      ['PROCESSING', 'UPLOADING'].includes(video.status)
                  "
                  class="mb-3"
                  color="primary"
                  width="8"
                  size="256"
                  indeterminate
                >
                  <span class="black--text">
                    <span v-if="video.status === 'UPLOADING'">
                      Uploading
                    </span>

                    <span v-else>
                      Processing
                    </span>
                  </span>
                </v-progress-circular>

                <validation-provider
                  v-slot="{ errors }"
                  name="Video"
                >
                  <pg-file-uploader
                    ref="videoFileUploaderRef"
                    v-model="video"
                    :error-messages="errors"
                    append-icon="mdi-video"
                    label="Upload Video"
                    mode="video"
                    multi-part
                    api="dropbox"
                    path="kids-corner-video"
                    placeholder="Select a video"
                    solo-labeled
                    mp4
                    mov
                    mpeg
                    webm
                  />
                </validation-provider>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="text-md-right" cols="12" sm="3">
                <span class="subheader font-weight-bold">Language:</span>
              </v-col>

              <v-col cols="12" sm="9" lg="6">
                <pg-select
                  v-model="languageId"
                  :items="listLanguage"
                  label="Language"
                  solo-labeled
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          class="px-5 text-none"
          color="accent"
          :loading="loading"
          x-large
          @click.stop="save"
        >
          Finalize
        </v-btn>
        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, useRouter, useRoute, onMounted, computed, nextTick } from '@nuxtjs/composition-api'
import { useActivity, useCurriculumTypes, useReportCardTypes } from '@/composables'
import { useKidsCorner } from '@/composables/kids-corner'
import { KidsCornerVideo, Video } from '@/models'
// @ts-ignore
import PgVideoPlayer from '@gold-media-tech/pg-video-player'
import { PlayerInstance } from '@gold-media-tech/pg-video-player/src/types/PlayerInstance'
import { MediaObject } from '@gold-media-tech/pg-video-player/src/types/MediaObject'

export default defineComponent({
  name: 'KidsCornerVideosEditor',
  components: {
    PgVideoPlayer
  },
  setup () {
    const route = useRoute()
    const router = useRouter()
    const loading = ref(false)
    const feature = ref({ top: true, offsetY: true })
    const id = ref<null|number>()
    const languageId = ref<number | null>(null)
    const thumbnail = ref<any | null>(null)
    const video = ref<Video | null>(null)
    const playerInstance = ref<PlayerInstance | null>(null)
    const topicsList = ref<string[]>([])
    const selectedReportCard = ref<number[]>([])
    const { activities, getActivitesType } = useActivity()
    const { reportCardTypes, getReportCardTypes } = useReportCardTypes()
    const { curriculumTypes, getCurriculumTypes } = useCurriculumTypes()
    const { getKidsCornerById, saveKidsCorner, updateKidsCorner, getTopics } = useKidsCorner()
    const thumbnailFileUploaderRef = ref<any | null>(null)
    const videoFileUploaderRef = ref<any | null>(null)
    const kidsCornerVideo = ref<Partial<KidsCornerVideo>>({
      name: '',
      description: '',
      videoId: null,
      thumbnail: '',
      curriculumTypeId: null,
      activityTypeId: null,
      reportCardTypes: [],
      topics: []
    })

    const activityTypes = computed(() => {
      return activities.value.map(activity => ({ text: activity.name, value: activity.id }))
    })

    const listCurriculumTypes = computed(() => {
      return [{
        text: 'None',
        value: null
      },
      ...curriculumTypes.value.map(type => ({
        text: type.name,
        value: type.id
      }))]
    })

    const listLanguage = computed(() => {
      return [{
        text: 'English',
        value: null
      }]
    })

    const listRecordTypes = computed(() => {
      return reportCardTypes.value.map(reportCard => ({ text: reportCard.name, value: reportCard.id }))
    })

    const clearItem = () => {
      kidsCornerVideo.value.name = ''
      kidsCornerVideo.value.description = ''
      kidsCornerVideo.value.videoId = null
      kidsCornerVideo.value.thumbnail = ''
      kidsCornerVideo.value.curriculumTypeId = null
      kidsCornerVideo.value.activityTypeId = null
      kidsCornerVideo.value.reportCardTypes = []
      kidsCornerVideo.value.topics = []
      thumbnail.value = null
      video.value = null
      id.value = null
    }

    const backList = () => {
      router.push({
        name: 'admin-kids-corner-videos'
      })
    }

    const save = async () => {
      loading.value = true
      if (selectedReportCard.value) {
        selectedReportCard.value.map((item) => {
          const itemSelected = reportCardTypes.value.find(value => item === value.id)
          if (itemSelected) {
            kidsCornerVideo.value.reportCardTypes?.push(itemSelected)
          }
        })
      }

      if (thumbnail.value && thumbnailFileUploaderRef.value) {
        if (thumbnailFileUploaderRef.value.type === 'dropBox') {
          const { filePath } = await thumbnailFileUploaderRef.value.handleDropBoxFileUpload()
          kidsCornerVideo.value.thumbnail = filePath
        } else {
          kidsCornerVideo.value.thumbnail = await thumbnailFileUploaderRef.value.handleUpload()
        }
      }

      let dataVideo = null
      if (video.value && videoFileUploaderRef.value) {
        if (videoFileUploaderRef.value.type === 'dropBox') {
          const { video } = await videoFileUploaderRef.value.handleDropBoxFileUpload()
          kidsCornerVideo.value.videoId = video.id
        } else {
          dataVideo = await videoFileUploaderRef.value.handleUpload()
          kidsCornerVideo.value.videoId = dataVideo.video.id
          video.value = dataVideo.video
        }
      }

      if (id.value) {
        await updateKidsCorner(id.value, { data: kidsCornerVideo.value })
      } else {
        await saveKidsCorner({ data: kidsCornerVideo.value })
      }
      clearItem()
      loading.value = false
      backList()
    }

    const onPlayerReady = (instance: PlayerInstance) => {
      playerInstance.value = instance
    }

    const waitAndLoad = (video: Video) => {
      return new Promise((resolve, reject) => {
        const start = new Date().getTime()
        const { name, thumbnail, videoUrl } = video
        const mediaObject: MediaObject = {
          title: name,
          poster: thumbnail,
          src: {
            url: videoUrl.HLS,
            type: 'application/x-mpegURL'
          }
        }

        const interval = window.setInterval(() => {
          if (playerInstance.value) {
            playerInstance.value.loadPlaylist([mediaObject])
            window.clearInterval(interval)
            resolve(true)
            return
          }
          const elapsed = new Date().getTime() - start
          if (elapsed > 30000) {
            window.clearInterval(interval)
            reject(new Error('Player loading timed out'))
          }
        }, 50)
      })
    }

    onMounted(async () => {
      if (route.value.query.id) {
        id.value = Number(route.value.query.id)
      }
      await getActivitesType({ activity: true })
      await getCurriculumTypes()
      await getReportCardTypes()
      const topics = await getTopics()
      if (topics.length > 0) {
        topicsList.value = topics.map((item: { topic: string }) => item.topic)
      }

      if (id.value) {
        const data = await getKidsCornerById(id.value)
        kidsCornerVideo.value.activityTypeId = data.activityType.id
        kidsCornerVideo.value.curriculumTypeId = data.curriculumType.id
        kidsCornerVideo.value.videoId = data.video.id
        if (data.reportCardTypes) {
          selectedReportCard.value = data.reportCardTypes.map((item: { id: number }) => item.id)
        }
        if (data.topics && data.topics.length > 0) {
          kidsCornerVideo.value.topics = data.topics.map((item: { topic: string }) => item.topic)
        }
        kidsCornerVideo.value.name = data.video.name
        kidsCornerVideo.value.description = data.video.description
        kidsCornerVideo.value.thumbnail = data.video.thumbnail
        video.value = data.video
        if (data.video && data.video.videoUrl && data.video.videoUrl.HLS) {
          waitAndLoad(data.video)
        }
      }
    })

    return {
      selectedReportCard,
      feature,
      loading,
      thumbnail,
      video,
      languageId,
      activityTypes,
      kidsCornerVideo,
      topicsList,
      listCurriculumTypes,
      listRecordTypes,
      listLanguage,
      thumbnailFileUploaderRef,
      videoFileUploaderRef,
      backList,
      save,
      onPlayerReady
    }
  }
})
</script>
