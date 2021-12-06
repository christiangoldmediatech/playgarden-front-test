<template>
  <v-card class="mx-1" width="100%">
    <v-card-title>
      <label class="title-dashboard font-weight-bold">{{ title }}</label>
    </v-card-title>
    <v-card-text>
      <v-list three-line>
        <template v-for="(video, index) in videoList">
          <v-list-item
            :key="index"
          >
            <v-list-item-avatar>
              <v-img :src="video.thumbnail" />
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title v-html="video.name" />
              <v-list-item-subtitle v-html="video.description" />
              <v-list-item-subtitle v-html="'Views: ' + video.views" />
              <v-divider />
            </v-list-item-content>
            <v-list-item-action>
              <v-btn icon>
                <v-icon color="accent lighten-1">
                  mdi-information
                </v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </template>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
export default defineComponent({
  name: 'TopVideos',
  props: {
    videoList: {
      type: Array,
      default: []
    },
    title: {
      type: String,
      default: ''
    }
  },
  setup() {}
})
</script>
