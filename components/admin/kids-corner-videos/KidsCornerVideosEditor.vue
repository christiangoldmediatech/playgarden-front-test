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
              nuxt
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
          <v-col cols="7">
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
                  v-model="kidsCornerVideo.reportCardTypeId"
                  :items="listRecordTypes"
                  label="Report card type"
                  solo-labeled
                />
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="5">
            <v-row>
              <v-col class="text-md" cols="12">
                <span class="subheader font-weight-bold">Thumbnail:</span>
              </v-col>

              <v-col class="text-center" cols="12">
                <v-img
                  v-if="kidsCornerVideo.thumbnail"
                  class="mb-6"
                  width="100%"
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
              <v-col class="text-md" cols="12">
                <span class="subheader font-weight-bold">Video:</span>
              </v-col>

              <v-col class="text-center" cols="12">
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
              <v-col class="text-md" cols="12">
                <span class="subheader font-weight-bold">Language:</span>
              </v-col>

              <v-col cols="12">
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
import { defineComponent, ref, useRouter, useRoute, onMounted, computed } from '@nuxtjs/composition-api'
import { useActivity, useCurriculumTypes, useReportCardTypes } from '@/composables'
import { useKidsCorner } from '@/composables/kids-corner'
import { KidsCornerVideo } from '@/models'

export default defineComponent({
  name: 'KidsCornerVideosEditor',
  setup () {
    const route = useRoute()
    const router = useRouter()
    const loading = ref(false)
    const id = ref<null|number>()
    const languageId = ref<number | null>(null)
    const thumbnail = ref<any | null>(null)
    const video = ref<any | null>(null)
    const { activities, getActivitesType } = useActivity()
    const { reportCardTypes, getReportCardTypes } = useReportCardTypes()
    const { curriculumTypes, getCurriculumTypes } = useCurriculumTypes()
    const { getKidsCornerById, saveKidsCorner, updateKidsCorner } = useKidsCorner()
    const thumbnailFileUploaderRef = ref<any | null>(null)
    const videoFileUploaderRef = ref<any | null>(null)
    const kidsCornerVideo = ref<Partial<KidsCornerVideo>>({
      name: '',
      description: '',
      videoId: null,
      thumbnail: '',
      curriculumTypeId: null,
      activityTypeId: null,
      reportCardTypeId: null,
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
      kidsCornerVideo.value.reportCardTypeId = null
      kidsCornerVideo.value.topics = []
      thumbnail.value = ''
      video.value = ''
    }

    const backList = () => {
      router.push({
        name: 'admin-kids-corner-videos'
      })
    }

    const save = async () => {
      loading.value = true
      if (thumbnail && thumbnailFileUploaderRef.value) {
        if (thumbnailFileUploaderRef.value.type === 'dropBox') {
          const { filePath } = await thumbnailFileUploaderRef.value.handleDropBoxFileUpload()
          kidsCornerVideo.value.thumbnail = filePath
        } else {
          kidsCornerVideo.value.thumbnail = await thumbnailFileUploaderRef.value.handleUpload()
        }
      }

      let dataVideo = null
      if (video && videoFileUploaderRef.value) {
        if (videoFileUploaderRef.value.type === 'dropBox') {
          const { filePath } = await videoFileUploaderRef.value.handleDropBoxFileUpload()
          dataVideo = filePath
        } else {
          dataVideo = await videoFileUploaderRef.value.handleUpload()
        }
      }
      kidsCornerVideo.value.videoId = dataVideo.video.id
      await saveKidsCorner({ data: kidsCornerVideo.value })
      clearItem()
      loading.value = false
      backList()
    }

    onMounted(async () => {
      id.value = Number(route.value.query.id)
      await getActivitesType({ activity: true })
      await getCurriculumTypes()
      await getReportCardTypes()
      if (id.value) {
        const data = await getKidsCornerById(id.value)
        kidsCornerVideo.value.activityTypeId = data.activityType.id
        kidsCornerVideo.value.curriculumTypeId = data.curriculumType.id
        kidsCornerVideo.value.reportCardTypeId = data.reportCardType.id
        kidsCornerVideo.value.name = data.video.name
        kidsCornerVideo.value.description = data.video.description
        kidsCornerVideo.value.thumbnail = data.video.thumbnail
      }
    })

    return {
      loading,
      thumbnail,
      video,
      languageId,
      activityTypes,
      kidsCornerVideo,
      listCurriculumTypes,
      listRecordTypes,
      listLanguage,
      thumbnailFileUploaderRef,
      videoFileUploaderRef,
      backList,
      save
    }
  }
})
</script>
