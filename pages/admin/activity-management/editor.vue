<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-title>
            {{ title }}
            <v-spacer />
            <v-btn
              class="text-none"
              color="accent darken-1"
              depressed
              nuxt
              small
              :to="{ name: 'admin-activity-management' }"
            >
              Back
            </v-btn>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <validation-observer v-slot="{ invalid, passes }">
            <v-card-text>
              <v-form>
                <validation-provider v-slot="{ errors }" name="Activity Title" rules="required">
                  <v-text-field
                    v-model="activity.name"
                    :error-messages="errors"
                    label="Activity Title"
                    solo
                  />
                </validation-provider>

                <validation-provider v-slot="{ errors }" name="Description" rules="required">
                  <v-textarea
                    v-model="activity.description"
                    :error-messages="errors"
                    label="Description"
                    solo
                  />
                </validation-provider>

                <validation-provider v-slot="{ errors }" name="Category" rules="required">
                  <v-select
                    v-model="activity.activityTypeId"
                    :error-messages="errors"
                    :items="activityTypes"
                    label="Category"
                    solo
                  />
                </validation-provider>

                <file-uploader
                  ref="fileUploader"
                  :file.sync="file"
                  label="Upload Video"
                  mode="image"
                  mpeg
                  mov
                  path="activity-video"
                  placeholder="Select a video for this activity"
                  prepend-icon="mdi-video"
                  webm
                />

                <v-checkbox
                  v-model="activity.featured"
                  color="primary darken-2"
                  label="Featured"
                />
              </v-form>
            </v-card-text>

            <v-card-actions>
              <v-spacer />
              <v-btn
                class="px-5 text-none"
                color="primary"
                :disabled="invalid || loading"
                :loading="loading"
                x-large
                @click.stop="passes(save)"
              >
                Finalize
              </v-btn>
              <v-spacer />
            </v-card-actions>
          </validation-observer>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Editor',

  layout: 'admin',

  data () {
    return {
      loading: false,
      file: null,
      activity: {
        featured: false,
        name: '',
        description: '',
        activityTypeId: null,
        url: '',
        type: 'VIDEO'
      }
    }
  },

  computed: {
    ...mapGetters('admin/activity', ['rows', 'types']),

    id () {
      return (this.$route.query.id) ? parseInt(this.$route.query.id) : null
    },

    title () {
      return this.id ? 'Edit Activity' : 'New Activity'
    },

    activityTypes () {
      return this.types.map(type => ({
        text: type.name,
        value: type.id
      }))
    }
  },

  async created () {
    this.loading = true
    const promises = []

    promises.push(this.getTypes())

    if (this.id) {
      promises.push(this.getActivityById(this.id))
    }

    const results = await Promise.all(promises)

    if (results[1]) {
      const data = results[1]
      this.activity.featured = data.featured
      this.activity.name = data.name
      this.activity.description = data.description
      // this.activity.activityTypeId = data.activityType.id
      this.activity.url = data.url
    }

    this.loading = false
  },

  methods: {
    ...mapActions('admin/activity', [
      'getActivities', 'getActivityById', 'createActivity', 'updateActivity', 'getTypes'
    ]),

    async save () {
      this.loading = true
      try {
        const videoUrl = await this.$refs.fileUploader.handleFileUpload()
        this.activity.url = videoUrl
        if (this.id === null) {
          await this.createActivity(this.actvitiy)
        } else {
          this.user.password = undefined
          await this.updateActivity({ id: this.id, data: this.activity })
        }
      } catch (err) {
        this.loading = false
        return
      } finally {
        this.$router.push({ name: 'admin-activity-management' })
      }
    }
  }
}
</script>
