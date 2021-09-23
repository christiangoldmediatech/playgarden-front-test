<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-title>
            Kids corner videos - Management

            <v-spacer />

            <v-btn
              class="mr-2 text-none"
              color="primary darken-1"
              dark
              :icon="$vuetify.breakpoint.xs"
              nuxt
              :to="{ name: 'admin-kids-corner-videos-editor' }"
            >
              <v-icon class="hidden-sm-and-up">
                mdi-plus-circle
              </v-icon>

              <v-icon class="hidden-xs-only" small>
                mdi-plus
              </v-icon>
              <span class="hidden-xs-only white--text">
                Add new kids corner video
              </span>
            </v-btn>
          </v-card-title>

          <v-card-text>
            View, create, update, or delete kids corner videos.
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-card width="100%">
      <v-card-text>
        <v-row>
          list kids videos
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'defineComponent'
})
</script>
