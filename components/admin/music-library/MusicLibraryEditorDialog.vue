<template>
  <validation-observer ref="obs" v-slot="{ invalid, passes }">
    <v-dialog
      v-model="dialog"
      :fullscreen="$vuetify.breakpoint.xs"
      max-width="800px"
      persistent
    >
      <v-card>
        <v-toolbar class="flex-grow-0" color="primary darken-1" dark dense flat>
          <v-toolbar-title class="white--text">
            {{ title }}
          </v-toolbar-title>

          <v-spacer />

          <v-btn :disabled="loading" icon @click.stop="close">
            <v-icon>
              mdi-close
            </v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text class="pt-5">
          <v-container>
            <v-form ref="roleForm" @submit.prevent="passes(save)">
              <validation-provider
                v-slot="{ errors }"
                name="Name"
                rules="required"
              >
                <pg-text-field
                  v-model="item.name"
                  :error-messages="errors"
                  label="Name"
                  solo-labeled
                />
              </validation-provider>

              <validation-provider
                v-slot="{ errors }"
                name="Description"
                rules="required"
              >
                <pg-textarea
                  v-model="item.description"
                  :error-messages="errors"
                  label="Description"
                  solo-labeled
                />
              </validation-provider>

              <validation-provider
                v-slot="{ errors }"
                name="Curriculum"
                rules="required"
              >
                <pg-select
                  v-model="item.curriculumTypeId"
                  :error-messages="errors"
                  label="Curriculum"
                  :items="types"
                  item-text="name"
                  item-value="id"
                  solo-labeled
                />
              </validation-provider>

              <validation-provider
                v-slot="{ errors }"
                name="Song"
                :rules="{ required: Boolean(!id && !audio) }"
              >
                <pg-file-uploader
                  ref="audioFileUploaderDropBox"
                  v-model="audio"
                  :error-messages="errors"
                  append-icon="mdi-volume-high"
                  label="Upload Song"
                  mode="song"
                  api="dropbox"
                  path="song-audio"
                  placeholder="Select a song"
                  solo-labeled
                  mp3
                  @sendFile="setAudioFile"
                />
              </validation-provider>

              <!-- Thumbnail -->
              <v-img
                v-if="item.thumbnail"
                class="mx-auto"
                max-width="640"
                :src="item.thumbnail"
              />

              <validation-provider
                v-slot="{ errors }"
                name="Song Thumbnail"
                :rules="{
                  required: !item.thumbnail && !thumbnail,
                  size: 10000
                }"
              >
                <pg-file-uploader
                  ref="imageFileUploaderDropBox"
                  v-model="thumbnail"
                  append-icon="mdi-camera"
                  :error-messages="errors"
                  label="Song Thumbnail"
                  mode="image"
                  path="song-thumbnail"
                  placeholder="Select a thumbnail for this song"
                  solo-labeled
                  api="dropbox"
                  jpg
                  png
                  svg
                  @sendFile="setImageFile"
                />
              </validation-provider>
            </v-form>
          </v-container>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />

          <v-btn
            color="green"
            :dark="$vuetify.breakpoint.xs"
            :disabled="invalid"
            :loading="loading"
            :text="$vuetify.breakpoint.smAndUp"
            @click.stop="passes(save)"
          >
            Save
          </v-btn>

          <v-btn
            color="red"
            :dark="$vuetify.breakpoint.xs"
            :disabled="loading"
            :text="$vuetify.breakpoint.smAndUp"
            @click.stop="close"
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </validation-observer>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

const itemTemplate = {
  name: '',
  description: '',
  thumbnail: null,
  songUrl: null,
  curriculumTypeId: null
}

export default {
  name: 'MusicLibraryEditorDialog',

  data: () => {
    return {
      dialog: false,
      loading: false,
      thumbnail: null,
      audio: null,
      id: null,
      item: JSON.parse(JSON.stringify(itemTemplate))
    }
  },

  computed: {
    ...mapGetters('admin/curriculum', ['types']),

    title () {
      return this.id === null ? 'New Music Library' : 'Edit Music Library'
    }
  },

  methods: {

    ...mapActions('admin/music-library', {
      create: 'createMusicLibrary',
      update: 'updateMusicLibrary'
    }),

    ...mapActions('admin/curriculum', [
      'getTypes'
    ]),

    onPlayerReady (player) {
      this.player = player
    },

    reset () {
      this.id = null
      this.audio = null
      this.thumbnail = null
      this.item = JSON.parse(JSON.stringify(itemTemplate))
    },

    open (evt, item = null) {
      this.getTypes()
      this.reset()
      if (item) {
        this.loadItem(item)
      }
      this.dialog = true
    },

    loadItem (item) {
      this.id = item.id
      // Handle keys
      Object.keys(item).forEach((key) => {
        if (Object.prototype.hasOwnProperty.call(this.item, key)) {
          this.item[key] = item[key]
        }
      })
      this.item.curriculumTypeId = item.curriculumType.id
    },

    close () {
      this.dialog = false
    },

    setImageFile (type) {
      this.typeSelectImageFile = type
    },

    setAudioFile (type) {
      this.typeSelectAudioFile = type
    },

    async save () {
      try {
        this.loading = true
        if (this.audio) {
          if (this.typeSelectAudioFile !== 'dropBox') {
            this.item.songUrl = await this.$refs.audioFileUploaderDropBox.handleUpload()
          } else {
            this.loadingDropBox = true
            const { filePath } = await this.$refs.audioFileUploaderDropBox.handleDropBoxFileUpload()
            this.item.songUrl = filePath
          }
        }

        if (this.thumbnail) {
          if (this.typeSelectImageFile !== 'dropBox') {
            this.item.thumbnail = await this.$refs.imageFileUploaderDropBox.handleUpload()
          } else {
            const { filePath } = await this.$refs.imageFileUploaderDropBox.handleDropBoxFileUpload()
            this.item.thumbnail = filePath
          }
        }

        if (this.id) {
          await this.update({ id: this.id, data: this.item })
        } else {
          await this.create(this.item)
        }

        this.$emit('saved')
        this.close()
      } catch (error) {
        Promise.reject(error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
