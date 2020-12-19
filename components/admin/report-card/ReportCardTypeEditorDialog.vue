<template>
  <validation-observer ref="obs" v-slot="{ invalid, passes }">
    <v-dialog
      v-model="dialog"
      :fullscreen="$vuetify.breakpoint.xs"
      max-width="750px"
      persistent
      scrollable
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

        <v-card-text>
          <v-container>
            <v-form ref="reportCardTypeForm" @submit.prevent="passes(save)">
              <validation-provider
                v-slot="{ errors }"
                name="Report Card Type Name"
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
                name="Report Card Type Description"
                rules="required"
              >
                <pg-textarea
                  v-model="item.description"
                  :error-messages="errors"
                  label="Description"
                  solo-labeled
                />
              </validation-provider>

              <v-img
                v-if="item.icon"
                max-width="250"
                :src="item.icon"
              />

              <validation-provider
                v-slot="{ errors }"
                name="Icon"
                :rules="{
                  required: !item.icon && !icon,
                  size: 10000
                }"
              >
                <file-uploader
                  ref="fileUploader"
                  v-model="icon"
                  append-icon="mdi-camera"
                  :error-messages="errors"
                  label="Upload icon"
                  mode="image"
                  path="report-card-icon"
                  placeholder="Select a icon for this report card"
                  solo-labeled
                  jpg
                  png
                  svg
                />
              </validation-provider>

              <validation-provider
                v-slot="{ errors }"
                name="Progressing"
                rules="required"
              >
                <pg-textarea
                  v-model="item.progressing"
                  :error-messages="errors"
                  label="Progressing"
                  solo-labeled
                />
              </validation-provider>

              <validation-provider
                v-slot="{ errors }"
                name="Area Strenght"
                rules="required"
              >
                <pg-textarea
                  v-model="item.areaStrenght"
                  :error-messages="errors"
                  label="Area Strenght"
                  solo-labeled
                />
              </validation-provider>

              <validation-provider
                v-slot="{ errors }"
                name="Age Appropiate"
                rules="required"
              >
                <pg-text-field
                  v-model="item.ageAppropiate"
                  :error-messages="errors"
                  label="Age Appropiate"
                  solo-labeled
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
import { mapActions } from 'vuex'

export default {
  name: 'ReportCardTypeEditorDialog',

  data () {
    return {
      dialog: false,
      loading: false,
      valid: true,
      id: null,
      icon: null,
      item: {
        name: '',
        description: '',
        icon: '',
        progressing: null,
        ageAppropiate: null,
        areaStrenght: null
      }
    }
  },

  computed: {
    title () {
      return this.id === null
        ? 'New Report Card Type'
        : 'Edit Report Card Type'
    }
  },

  methods: {
    ...mapActions('admin/report-card', [
      'createType',
      'updateType',
      'getTypes'
    ]),

    close () {
      this.$nextTick(() => {
        this.dialog = false
        this.loading = false
        this.$refs.obs.reset()
      })
    },

    async save () {
      this.loading = true
      try {
        const icon = await this.$refs.fileUploader.handleUpload()
        if (icon) {
          this.item.icon = icon
        }
        if (this.id === null) {
          await this.createType(this.item)
        } else {
          await this.updateType({ id: this.id, data: this.item })
        }

        await this.getTypes()

        this.close()
      } catch (err) {
      } finally {
        this.loading = false
      }
    },

    open ({ id = null, name = '', description = '', icon = '', descriptionProgress = {} } = {}) {
      this.id = id
      this.item.name = name
      this.item.description = description
      this.item.icon = icon
      if (descriptionProgress) {
        const { progressing, ageAppropiate, areaStrenght } = descriptionProgress
        this.item.progressing = progressing
        this.item.ageAppropiate = ageAppropiate
        this.item.areaStrenght = areaStrenght
      } else {
        this.item.progressing = ''
        this.item.ageAppropiate = ''
        this.item.areaStrenght = ''
        this.icon = ''
      }
      this.$nextTick(() => {
        this.dialog = true
      })
    }
  }
}
</script>
