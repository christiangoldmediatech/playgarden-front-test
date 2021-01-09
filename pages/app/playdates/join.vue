<template>
  <v-main class="mt-n16">
    <v-col class="mt-n16">
      <v-row
        class="mt-n16"
        :class="{ mobile: $vuetify.breakpoint.smAndDown }"
        no-gutters
      >
        <v-col cols="12">
          <v-row>
            <v-col>
              <underlined-title
                text="Educational Playdates"
                class="text-md-h5 mt-10"
              />
            </v-col>

            <v-col>
              <v-row justify-md="end" class="mr-md-n16">
                <v-btn
                  nuxt
                  :to="{ name: 'app-playdates-create' }"
                  width="200"
                  large
                  color="accent"
                  class="text-btn"
                >
                  Create Playdate
                </v-btn>

                <v-btn
                  nuxt
                  :to="{ name: 'app-playdates-find' }"
                  width="200"
                  large
                  color="primary"
                  class="text-btn ml-5"
                >
                  Find Playdate
                </v-btn>
              </v-row>
            </v-col>

            <v-row no-gutters>
              <p>
                A playdate is a place where your child can have fun with their
                friends while they have fun playing all supervised by a
                specialist.
              </p>
            </v-row>
          </v-row>
        </v-col>
      </v-row>
    </v-col>

    <v-container fluid>
      <v-row dense>
        <v-col cols="12" md="6">
          <card-playdate />
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import CardPlaydate from '@/components/app/playdates/CardPlaydate'

export default {
  name: 'Join',
  components: { CardPlaydate }
}
</script>
