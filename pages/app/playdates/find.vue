<template>
  <v-main class="mt-n5">
    <v-col class="mt-n10">
      <v-row
        class="mt-mb-n16 mt-sm-n6"
        :class="{ mobile: $vuetify.breakpoint.smAndDown }"
        no-gutters
      >
        <v-col cols="12">
          <v-row no-gutters justify="start">
            <v-btn
              class="top-left text-none"
              color="#f89838"
              nuxt
              :to="{ name: 'app-playdates' }"
              text
              exact
            >
              <v-icon class="mr-2" small left color="#f89838">
                mdi-less-than
              </v-icon>
              Back
            </v-btn>
          </v-row>

          <v-row class="mt-md-5">
            <underlined-title
              text="Find the playdate that best suits your child"
              class="text-h5 mt-5"
            />
            <p class="mt-5">
              Here you will find playdates from other playgardenprep partners
              with available places!
            </p>
          </v-row>
        </v-col>
      </v-row>
    </v-col>

    <v-container fluid>
      <v-row dense>
        <v-col cols="12" md="6">
          <card-playdate />
        </v-col>

        <v-col>
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark v-bind="attrs" v-on="on">
              Open Dialog
            </v-btn>
          </template>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import CardPlaydate from '@/components/app/playdates/CardPlaydate'

export default {
  name: 'Find',
  components: { CardPlaydate }
}
</script>
