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
              :to="{ name: 'admin-kids-corner-videos-editor' }"
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
                    v-model="name"
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
                    v-model="description"
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
          </v-col>
          <v-col cols="5">
            <v-row>
              <v-col class="text-md" cols="12">
                <span class="subheader font-weight-bold">Thumbnail:</span>
              </v-col>

              <v-col class="text-center" cols="12">
                <!-- <v-img
                  v-if="activity.thumbnail"
                  max-width="250"
                  :src="activity.thumbnail"
                /> -->

                <validation-provider
                  v-slot="{ errors }"
                  name="Thumbnail"
                >
                  <pg-file-uploader
                    ref="imageFileUploaderDropBox"
                    v-model="thumbnail"
                    append-icon="mdi-camera"
                    :error-messages="errors"
                    label="Upload Thumbnail"
                    mode="image"
                    path="activity-thumbnail"
                    placeholder="Select a thumbnail for this activity video"
                    solo-labeled
                    api="dropbox"
                    jpg
                    png
                    svg
                    @sendFile="setImageFile"
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
                  name="Thumbnail"
                >
                  <pg-file-uploader
                    ref="imageFileUploaderDropBox"
                    v-model="thumbnail"
                    append-icon="mdi-camera"
                    :error-messages="errors"
                    label="Upload Thumbnail"
                    mode="image"
                    path="activity-thumbnail"
                    placeholder="Select a thumbnail for this activity video"
                    solo-labeled
                    api="dropbox"
                    jpg
                    png
                    svg
                    @sendFile="setImageFile"
                  />
                </validation-provider>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from '@vue/composition-api'
import { useActivity, useCurriculumTypes } from '@/composables'
import { KidsCornerVideo } from '@/models'

export default defineComponent({
  name: 'KidsCornerVideosEditor',
  setup () {
    const thumbnail = ref<String | null>(null)
    const video = ref<String | null>(null)
    const name = ref<String | null>(null)
    const description = ref<String | null>(null)
    const { activities, getActivitesType } = useActivity()
    const { curriculumTypes, getCurriculumTypes } = useCurriculumTypes()
    const kidsCornerVideo = ref<Partial<KidsCornerVideo>>({
      curriculumTypeId: null,
      activityTypeId: null,
      reportCardTypeId: null,
      videoId: null,
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

    const setImageFile = () => {}

    onMounted(async () => {
      await getActivitesType({ activity: true })
      await getCurriculumTypes()
    })

    return {
      name,
      description,
      thumbnail,
      video,
      activityTypes,
      kidsCornerVideo,
      listCurriculumTypes,
      setImageFile
    }
  }
})
</script>
