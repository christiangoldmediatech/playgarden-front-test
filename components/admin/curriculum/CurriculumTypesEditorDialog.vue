<template>
  <validation-observer ref="obs" v-slot="{ invalid, passes }">
    <v-dialog
      v-model="dialog"
      :fullscreen="$vuetify.breakpoint.xs"
      max-width="500px"
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
            <v-form @submit.prevent="passes(save)">
              <!-- Name -->
              <validation-provider
                v-slot="{ errors }"
                name="Curriculum Type Name"
                rules="required"
              >
                <pg-text-field
                  v-model="item.name"
                  :error-messages="errors"
                  label="Name"
                  solo-labeled
                />
              </validation-provider>

              <!-- Description -->
              <validation-provider
                v-slot="{ errors }"
                name="Curriculum Type Description"
                rules="required"
              >
                <pg-textarea
                  v-model="item.description"
                  :error-messages="errors"
                  label="Description"
                  solo-labeled
                />
              </validation-provider>

              <!-- Icon -->
              <span class="v-label theme--light">Icon</span>

              <template v-if="item.icon">
                <div class="mb-6 mt-3">
                  <v-badge avatar color="white" overlap>
                    <template v-slot:badge>
                      <v-avatar
                        class="clickable"
                        @click.native="item.icon = null"
                      >
                        <v-icon color="#757575" size="20">
                          mdi-close
                        </v-icon>
                      </v-avatar>
                    </template>

                    <v-img width="250" :src="item.icon" />
                  </v-badge>
                </div>
              </template>

              <validation-provider
                v-else
                v-slot="{ errors }"
                name="Icon"
                rules="required|size:10000"
              >
                <file-uploader
                  ref="iconUploader"
                  v-model="icon"
                  :error-messages="errors"
                  label="Upload Icon"
                  mode="image"
                  path="curriculum-type"
                  placeholder="Select a icon for this Curriculum Type"
                  prepend-icon="mdi-camera"
                  solo-labeled
                  jpg
                  png
                  svg
                />
              </validation-provider>

              <!-- Letter -->
              <validation-provider
                v-slot="{ errors }"
                name="Curriculum Type Letter"
                rules="required"
              >
                <pg-select
                  v-model="item.letter"
                  :error-messages="errors"
                  :items="letters"
                  label="Letter"
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
  name: 'CurriculumTypesEditorDialog',

  data () {
    return {
      dialog: false,
      loading: false,
      valid: true,
      icon: null,
      id: null,
      item: {
        name: '',
        description: '',
        icon: '',
        letter: ''
      },
      letters: [
        'Aa',
        'Bb',
        'Cc',
        'Dd',
        'Ee',
        'Ff',
        'Gg',
        'Hh',
        'Ii',
        'Jj',
        'Kk',
        'Ll',
        'Mm',
        'Nn',
        'Oo',
        'Pp',
        'Qq',
        'Rr',
        'Ss',
        'Tt',
        'Uu',
        'Vv',
        'Ww',
        'Xx',
        'Yy',
        'Zz'
      ]
    }
  },

  computed: {
    title () {
      return this.id === null ? 'New Curriculum Type' : 'Edit Curriculum Type'
    }
  },

  methods: {
    ...mapActions('admin/curriculum', ['createType', 'updateType', 'getTypes']),

    close () {
      this.$nextTick(() => {
        this.icon = null
        this.dialog = false
        this.loading = false
        this.$refs.obs.reset()
      })
    },

    async save () {
      this.loading = true
      try {
        if (this.icon) {
          this.item.icon = await this.$refs.iconUploader.handleUpload()
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

    open ({
      id = null,
      name = '',
      description = '',
      icon = '',
      letter = ''
    } = {}) {
      this.id = id
      this.item.name = name
      this.item.description = description
      this.item.icon = icon
      this.item.letter = letter

      this.$nextTick(() => {
        this.dialog = true
      })
    }
  }
}
</script>
