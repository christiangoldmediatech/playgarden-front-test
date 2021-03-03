<template>
  <div class="">
    <v-row justify="end">
      <v-btn
        class="text-h7 text-md-h6 mb-3 mr-4"
        color="primary"
        :small="$vuetify.breakpoint.xs"
        @click="addComponent"
      >
        + FILE
      </v-btn>
    </v-row>
    <template v-for="fileComponent in componentList">
      <v-row :key="fileComponent.number" no-gutters>
        <v-col cols="11">
          <validation-provider
            v-slot="{ errors }"
            :name="`File-${fileComponent}`"
            rules="required"
          >
            <pg-file-uploader
              :ref="fileComponent.ref"
              v-model="fileComponent.value"
              prepend-icon="mdi-file"
              :file-name="fileName"
              :error-messages="errors"
              :label="`Upload File-${fileComponent.number}`"
              mode="document"
              path="lesson"
              placeholder="Select a pdf for this lesson"
              solo-labeled
              api="dropbox"
              pdf
              @sendFile="setSourceFile"
            />
          </validation-provider>
        </v-col>
        <v-col cols="1">
          <v-btn
            class="mt-2"
            block
            text
            @click="removeComponent(fileComponent)"
          >
            <v-icon>
              mdi-delete
            </v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </template>
  </div>
</template>

<script>
// import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'UploadMultipleFiles',

  data: () => ({
    componentsNumber: 1,
    componentList: [],
    fileName: 'file',
    file: null,
    typeSelectDocumentFile: null
  }),

  computed: {
    buildComponents () {
      return this.componentList
    },
    getTotalComponents () {
      return this.componentsNumber
    }
  },

  watch: {
    componentList (val) {}
  },

  created () {
    this.componentList.push({ ref: `documentFileUploaderDropBox-${this.componentsNumber}`, value: null, number: this.componentsNumber })
  },

  methods: {
    setSourceFile () {
      this.$emit('sendFile', 'dropBox')
    },
    addComponent () {
      this.componentsNumber += 1
      this.componentList.push({ ref: `documentFileUploaderDropBox-${this.componentsNumber}`, value: null, number: this.componentsNumber })
    },

    removeComponent (selected) {
      this.componentList = this.componentList.filter(component => component.number !== selected.number)
    },

    joinFiles () {
      const fileList = Promise.all(this.componentList.map((component) => {
        return this.$refs[`${component.ref}`][0].file
      }))
      return fileList
    }
  }
}
</script>
