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
        <v-row>
          <v-col cols="8">
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
                    :error-messages="errors"
                    label="Description"
                    solo-labeled
                  />
                </validation-provider>
              </v-col>
            </v-row>

            <v-row>
              <v-col class="text-md-right" cols="12" sm="3">
                <span class="subheader">Category:</span>
              </v-col>

              <v-col cols="12" sm="9" lg="6">
                <validation-provider
                  v-slot="{ errors }"
                  name="Category"
                  rules="required"
                >
                  <pg-select
                    :error-messages="errors"
                    label="Select a category"
                    solo-labeled
                  />
                </validation-provider>
              </v-col>
            </v-row>

            <v-row>
              <v-col class="text-md-right" cols="12" sm="3">
                <span class="subheader">Curriculum:</span>
              </v-col>

              <v-col cols="12" sm="9" lg="6">
                <pg-select
                  label="Curriculum"
                  solo-labeled
                />
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="4">
            images
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'KidsCornerVideosEditor',
  setup () {

  }
})
</script>
