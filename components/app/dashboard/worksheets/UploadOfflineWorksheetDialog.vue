<template>
  <pg-video-dialog
    content-class="upload-ow-dialog"
    :value="value"
    :persistent="!canRemoveOrUpload"
    max-width="1475px"
    @input="close"
  >
    <v-card rounded="0">
      <div class="green-line-bigger green-line-1" />
      <div class="green-line-bigger green-line-2" />

      <v-card-text class="pt-6">
        <v-row class="ma-0" justify="center">
          <h2 class="upload-ow-title">
            UPLOAD YOUR WORKSHEET
          </h2>
        </v-row>

        <v-row class="ma-0" justify="center">
          <h3 class="upload-ow-subtitle">
            * File(s) must be in
            <span class="upload-ow-subtitle-bold">JPG</span> or
            <span class="upload-ow-subtitle-bold">PNG</span> format only.
          </h3>
        </v-row>

        <v-row class="ma-0" justify="center">
          <div v-if="isChecking" class="ma-6">
            <v-progress-circular color="accent" size="128" width="8" indeterminate />
          </div>
          <div v-else-if="uploadFinished" class="pg-w-full ma-6 mt-0 mb-2">
            <div class="d-flex flex-wrap">
              <div
                v-for="item in uploadedList"
                :key="`finished-upload-${item.id}`"
                class="upload-ow-dialog-item"
              >
                <img :src="item.url">

                <v-btn
                  class="upload-ow-dialog-item-btn"
                  color="#FF0000"
                  fab
                  x-small
                  :disabled="!canRemoveOrUpload"
                  @click="removeUploadedFile(item.id)"
                >
                  <v-icon color="white" size="24">
                    mdi-trash-can-outline
                  </v-icon>
                </v-btn>
              </div>
            </div>

            <div class="d-flex justify-center">
              <div class="text-center mt-3">
                <div class="upload-ow-dialog-success mb-6">
                  UPLOAD SUCCESSFUL!
                </div>

                <v-btn
                  color="#68C453"
                  dark
                  x-large
                  :loading="!canRemoveOrUpload"
                  @click="resetParams"
                >
                  UPLOAD MORE
                </v-btn>
              </div>
            </div>
          </div>
          <div
            v-else-if="!uploadFinished"
            class="upload-ow-dialog-drag-area mb-2"
            @drop="addDroppedFiles"
            @dragover="dragOverHandler"
          >
            <!-- Thumbnails -->
            <template v-if="uploadedList.length || thumbnailList.length">
              <div class="d-flex flex-wrap">
                <div
                  v-for="item in uploadedList"
                  :key="`finished-upload-${item.id}`"
                  class="upload-ow-dialog-item"
                >
                  <img :src="item.url">

                  <v-btn
                    class="upload-ow-dialog-item-btn"
                    color="#FF0000"
                    fab
                    x-small
                    :disabled="!canRemoveOrUpload"
                    @click="removeUploadedFile(item.id)"
                  >
                    <v-icon color="white" size="24">
                      mdi-trash-can-outline
                    </v-icon>
                  </v-btn>
                </div>

                <div
                  v-for="item in thumbnailList"
                  :key="`pending-upload-${item.index}`"
                  class="upload-ow-dialog-item"
                >
                  <img :src="item.src">

                  <v-btn
                    class="upload-ow-dialog-item-btn"
                    color="#FF0000"
                    fab
                    x-small
                    :disabled="!canRemoveOrUpload"
                    @click="removePendingFile(item.index)"
                  >
                    <v-icon color="white" size="24">
                      mdi-close
                    </v-icon>
                  </v-btn>
                </div>

                <div
                  class="upload-ow-dialog-item d-flex flex-column align-center justify-center clickable"
                  @click.stop="openFileDialog"
                >
                  <v-btn color="#68C453" fab small @click.stop="openFileDialog">
                    <v-icon color="white" large>
                      mdi-plus
                    </v-icon>
                  </v-btn>

                  <div class="mt-6">
                    DRAG AND DROP YOUR DOCUMENTS OR UPLOAD MORE
                  </div>
                </div>
              </div>

              <div class="text-center mt-10 mb-2">
                <v-btn
                  color="#68C453"
                  :dark="!!thumbnailList.length"
                  x-large
                  :loading="!canRemoveOrUpload"
                  :disabled="!thumbnailList.length"
                  @click="uploadWorksheets"
                >
                  UPLOAD
                </v-btn>
                <br>
                <v-btn v-if="!!uploadedList.length" class="mt-3" color="accent" @click="goBack">
                  GO BACK
                </v-btn>
              </div>
            </template>

            <!-- Default empty status with controls -->
            <div v-else>
              <div class="text-center">
                <img
                  class="upload-ow-dialog-folder-icon"
                  src="@/assets/svg/ow-folder.svg"
                >
              </div>

              <div class="upload-ow-dialog-folder-text">
                DRAG YOUR WORKSHEET
              </div>

              <div class="d-flex flex-nowrap justify-center align-center">
                <div class="upload-ow-dialog-line" />
                <div class="upload-ow-dialog-line-text mx-6">
                  or
                </div>
                <div class="upload-ow-dialog-line" />
              </div>

              <div class="text-center mb-6">
                <v-btn color="accent" x-large @click="openFileDialog">
                  BROWSE FILES
                </v-btn>
              </div>
            </div>
          </div>

          <input
            id="owInputUpload"
            class="d-none"
            type="file"
            accept=".png, .jpg, .jpeg"
            multiple
            @change="setFiles"
          >
        </v-row>
        <v-row v-if="!isChecking" class="mb-2" justify="center" align="center">
          <v-btn
            color="accent"
            text
            x-large
            :disabled="!canRemoveOrUpload"
            @click.stop="close"
          >
            Return to lesson
          </v-btn>
        </v-row>
      </v-card-text>
    </v-card>
  </pg-video-dialog>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  watch,
  useStore
} from '@nuxtjs/composition-api'
import { useChildren, useNuxtHelper, useSnotifyHelper, useOfflineWorksheet } from '@/composables'
import { APP_EVENTS, UploadedOfflineWorksheet } from '@/models'

export default defineComponent({
  name: 'UploadOfflineWorksheetDialog',

  props: {
    value: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  setup(props, { emit }) {
    // Globals and helpers
    const store = useStore()
    const $nuxt = useNuxtHelper()
    const $snotify = useSnotifyHelper()
    const { currentChild } = useChildren({ store })
    const { uploadWorksheet, saveOfflineWorksheetProgress, getUploaded, removeUploadedOfflineWorksheet } = useOfflineWorksheet({ store })

    // Custom params
    const isUploading = ref(false)
    const isChecking = ref(false)
    const isRemoving = ref(false)
    const uploadFinished = ref(false)
    const fileList = ref<File[]>([])

    const canRemoveOrUpload = computed(() => {
      return !isUploading.value && !isRemoving.value
    })

    // List of uploaded offline worksheets
    const uploadedList = ref<UploadedOfflineWorksheet[]>([])

    // Computed list of thumbnails based on fileList
    const thumbnailList = computed(() => {
      return fileList.value.map((file: File, index: number) => {
        return {
          src: URL.createObjectURL(file),
          index
        }
      })
    })

    function resetParams() {
      isUploading.value = false
      uploadFinished.value = false
      resetFileList()
    }

    function resetFileList () {
      fileList.value = []
      const uploader = document.getElementById(
        'owInputUpload'
      ) as HTMLInputElement
      if (uploader) {
        const dt = new DataTransfer()
        uploader.files = dt.files
      }
    }

    async function getUploadedOfflineWorksheets(changeBack: boolean = true): Promise<void> {
      try {
        const childId = currentChild.value.id
        const lesson = store.getters['admin/curriculum/getLesson']
        const lessonId = lesson.id
        const result = await getUploaded(childId, lessonId)
        if (result && result.length) {
          if (changeBack) {
            uploadFinished.value = true
          }
          uploadedList.value = result
        } else {
          uploadedList.value = []
          uploadFinished.value = false
        }
      } catch (error) {
        return Promise.reject(error)
      }
    }

    async function removeUploadedFile(filedId: number) {
      try {
        isRemoving.value = true
        await removeUploadedOfflineWorksheet(filedId)
        await getUploadedOfflineWorksheets(false)
      } catch {
      } finally {
        isRemoving.value = false
      }
    }

    async function onOpen() {
      resetParams()
      isChecking.value = true
      uploadedList.value = []
      await getUploadedOfflineWorksheets()
      isChecking.value = false
    }

    watch(() => props.value, onOpen, { immediate: true })

    function openFileDialog() {
      const uploader = document.getElementById(
        'owInputUpload'
      ) as HTMLInputElement
      if (uploader) {
        uploader.click()
      }
    }

    function setFiles() {
      const uploader = document.getElementById(
        'owInputUpload'
      ) as HTMLInputElement
      if (uploader) {
        const files = uploader.files || []
        fileList.value = Array.from(files)
      }
    }

    function addDroppedFiles(e: DragEvent) {
      // Prevent default
      e.preventDefault()

      // Return if there is no dataTransfer object
      if (!e.dataTransfer) {
        return
      }

      // Define accepted types
      const types = ['image/png', 'image/jpeg']

      // Create a new DT with all currently loaded files
      const dt = new DataTransfer()
      const uploader = document.getElementById(
        'owInputUpload'
      ) as HTMLInputElement
      const { files } = uploader

      if (files) {
        for (let i = 0; i < files.length; i++) {
          dt.items.add(files[i])
        }
      }

      if (e.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        for (let i = 0; i < e.dataTransfer.items.length; i++) {
          // If dropped items aren't files, reject them
          if (e.dataTransfer.items[i].kind === 'file') {
            const file = e.dataTransfer.items[i].getAsFile()
            if (file) {
              if (types.includes(file?.type || '')) {
                dt.items.add(file)
              }
            }
          }
        }
      } else if (e.dataTransfer.files) {
        // Use DataTransfer interface to access the file(s)
        for (let i = 0; i < e.dataTransfer.files.length; i++) {
          const file = e.dataTransfer.files[i]
          if (file) {
            if (types.includes(file?.type || '')) {
              dt.items.add(file)
            }
          }
        }
      }
      uploader.files = dt.files
      setFiles()
    }

    function dragOverHandler(e: Event) {
      e.preventDefault()
    }

    function removePendingFile(index: number) {
      const dt = new DataTransfer()
      const uploader = document.getElementById(
        'owInputUpload'
      ) as HTMLInputElement
      const { files } = uploader
      if (files) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i]
          if (index !== i) {
            dt.items.add(file)
          }
        }
      }
      uploader.files = dt.files
      setFiles()
    }

    async function uploadWorksheets() {
      try {
        isUploading.value = true
        const lesson = store.getters['admin/curriculum/getLesson']
        const lessonId = lesson.id
        const offlineWorksheet = lesson.worksheets.find(
          ({ type }: { type: string }) => type === 'OFFLINE'
        )
        const offlineWorksheetId = offlineWorksheet.id || null
        const childId = currentChild.value.id
        const promises: Array<Promise<any>> = []

        if (lessonId && childId && offlineWorksheetId) {
          fileList.value.forEach((file) => {
            promises.push(
              uploadWorksheet({
                lessonId, childId, file
              })
            )
          })
        }

        if (promises.length) {
          promises.push(
            saveOfflineWorksheetProgress({ lessonId, childId, offlineWorksheetId, completed: true })
          )
        } else {
          throw new Error('No images to upload')
        }

        // Do all promises
        await Promise.allSettled(promises)
        await getUploadedOfflineWorksheets()
        resetFileList()

        $nuxt.$emit(APP_EVENTS.DASHBOARD_WORKSHEET_UPLOAD, lessonId)
        $snotify.success('Your worksheet has been uploaded!')
        $nuxt.$emit('dashboard-panel-update')

        uploadFinished.value = true
      } catch {
      } finally {
        isUploading.value = false
      }
    }

    function close () {
      emit('input', false)
    }

    function goBack () {
      resetParams()
      uploadFinished.value = true
    }

    return {
      canRemoveOrUpload,
      isChecking,
      uploadFinished,
      openFileDialog,
      setFiles,
      fileList,
      uploadedList,
      thumbnailList,
      addDroppedFiles,
      dragOverHandler,
      removePendingFile,
      removeUploadedFile,
      uploadWorksheets,
      resetParams,
      close,
      goBack
    }
  }
})
</script>

<style lang="scss">
.v-dialog.upload-ow-dialog {
  border-radius: 0;
  .upload-ow-title {
    color: #606060;
    font-size: 36px;
    font-weight: 700;
    line-height: 1.5;
    text-align: center;
  }

  .upload-ow-subtitle {
    font-size: 23px;
    font-weight: 500;
    text-align: center;
    margin-top: 2px;
    margin-bottom: 60px;
    .upload-ow-subtitle-bold {
      font-weight: 700;
    }
  }

  .upload-ow-dialog-drag-area {
    width: 100%;
    border: 5px dashed rgba(245, 142, 0, 0.49);
    border-radius: 16px;
    background: #f8f8f8;
    margin: 0px 2%;
    padding: 16px;
    @media screen and (min-width: 600px) {
      padding: 16px;
      border-radius: 20px;
      margin: 0px 4.25%;
    }

    @media screen and (min-width: 960px) {
      padding: 25px;
      border-radius: 24px;
      margin: 0px 7%;
    }

    @media screen and (min-width: 1264px) {
      padding: 32px;
      border-radius: 36px;
      margin: 0px 10.25%;
    }

    @media screen and (min-width: 1904px) {
      padding: 50px;
      border-radius: 54px;
      margin: 0px 14.25%;
    }

    .upload-ow-dialog-folder-icon {
      width: 54px;
      height: 54px;
      object-position: center;
      object-fit: contain;
    }

    .upload-ow-dialog-folder-text {
      font-size: 30px;
      line-height: 1.5;
      font-weight: 700;
      text-align: center;
    }

    .upload-ow-dialog-line {
      width: 62px;
      border-top: 5px solid rgba(96, 96, 96, 0.72);
    }

    .upload-ow-dialog-line-text {
      font-size: 36px;
      line-height: 1.5;
      font-weight: 700;
      text-align: center;
      color: rgba(96, 96, 96, 0.72);
    }
  }

  .upload-ow-dialog-item {
    position: relative;
    aspect-ratio: 21 / 14;
    width: calc(50% - 8px);
    margin: 4px;
    font-size: 15px;
    color: #606060;
    font-weight: 600;
    line-height: 1.5;
    text-align: center;

    @media screen and (min-width: 960px) {
      width: calc(33.33% - 8px);
    }

    @media screen and (min-width: 1264px) {
      width: calc(25% - 8px);
    }

    img {
      width: 100%;
      height: 100%;
      object-position: center;
      object-fit: cover;
      border-radius: 8px;
    }

    .upload-ow-dialog-item-btn {
      position: absolute;
      top: -16px;
      right: -16px;
      z-index: 6000;
    }
  }

  .upload-ow-dialog-success {
    color: #68C453;
    text-align: center;
    font-size: 36px;
    font-weight: 700;
    line-height: 1.5;
  }
}
</style>
